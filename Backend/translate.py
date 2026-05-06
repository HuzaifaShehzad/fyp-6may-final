"""
Translation utilities using Gemini via `google-genai`.
"""

import time
from typing import Callable, Optional

from google import genai
from google.genai.types import GenerateContentConfig

import config


def _normalize_target_lang(target_lang: str) -> str:
    """Normalize logical language names for prompts."""
    lang = (target_lang or "").strip().lower()
    mapping = {
        "urdu": "Urdu",
        "hindi": "Hindi",
        "punjabi": "Punjabi",
        "sindhi": "Sindhi",
        "english": "English",
        "pashto": "Pashto",
        "balochi": "Balochi",
    }
    return mapping.get(lang, target_lang)


def _sanitize_translated_text(text: str) -> str:
    """Remove invalid surrogate characters."""
    if not text:
        return text

    SURROGATE_START = 0xD800
    SURROGATE_END = 0xDFFF

    sanitized = ''.join(
        char for char in text
        if not (SURROGATE_START <= ord(char) <= SURROGATE_END)
    )

    try:
        sanitized.encode('utf-8')
    except UnicodeEncodeError:
        sanitized = sanitized.encode('utf-8', errors='replace').decode('utf-8', errors='replace')

    return sanitized


def _strip_qwen_thinking_blocks(text: str) -> str:
    """
    Remove Qwen-style <think>...</think> blocks from a model response.
    """
    if not text:
        return text
    lower = text.lower()
    if "<think" not in lower:
        return text
    import re
    # Handle both <think>...</think> and <think ...>...</think>
    cleaned = re.sub(r"<think\b[^>]*>[\s\S]*?</think>", "", text, flags=re.IGNORECASE).strip()
    return cleaned

def _strip_hallucinations(text: str) -> str:
    """
    Remove Chinese characters and conversational markers that the model might hallucinate.
    """
    if not text:
        return text
    import re
    # Remove Chinese characters
    text = re.sub(r'[\u4e00-\u9fff]+', '', text)
    # Remove Human/Assistant markers
    text = re.sub(r'\bHuman:\s*', '', text, flags=re.IGNORECASE)
    text = re.sub(r'\bAssistant:\s*', '', text, flags=re.IGNORECASE)
    # Remove empty brackets left over from Chinese removal
    text = re.sub(r'（\s*）', '', text)
    text = re.sub(r'\(\s*\)', '', text)
    # Clean up excessive newlines
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def _build_detailed_error(error_str: str, target_lang: str) -> str:
    """
    Parse the actual API / network error and return a detailed,
    language-aware message so the user AND developer can see exactly
    what went wrong.
    """
    error_lower = error_str.lower()

    # ── Detect specific error types ──
    if "503" in error_str or "unavailable" in error_lower or "high demand" in error_lower or "overloaded" in error_lower:
        error_type = "overloaded"
        en_detail = f"⚠️ Gemini API Error 503: The model is currently overloaded / experiencing high demand. Please try again in a few minutes."
        ur_detail = "⚠️ Gemini API خرابی 503: ماڈل اس وقت مصروف ہے / زیادہ طلب کا سامنا ہے۔ براہ کرم چند منٹ بعد دوبارہ کوشش کریں۔"
        sd_detail = "⚠️ Gemini API نقص 503: ماڊل هن وقت مصروف آهي / وڌيڪ مانگ جو سامنو آهي. مهرباني ڪري ٿوري دير کان پوءِ ٻيهر ڪوشش ڪريو."
        pa_detail = "⚠️ Gemini API خرابی 503: ماڈل ایس ویلے مصروف اے / بہت زیادہ لوڈ اے۔ مہربانی نال کجھ منٹ بعد دوبارہ کوشش کرو۔"
        ps_detail = "⚠️ Gemini API تېروتنه 503: ماډل اوس مهال بوخت دی. مهرباني وکړئ د څو دقیقو وروسته بیا هڅه وکړئ."

    elif "429" in error_str or "quota" in error_lower or "rate limit" in error_lower or "resource_exhausted" in error_lower:
        error_type = "quota"
        en_detail = f"⚠️ Gemini API Error 429: API quota exhausted or rate limit reached. You may need to wait or upgrade your API plan."
        ur_detail = "⚠️ Gemini API خرابی 429: API کوٹہ ختم ہو گیا ہے یا حد تک پہنچ گئی ہے۔ آپ کو انتظار کرنا ہو گا یا API پلان اپ گریڈ کرنا ہو گا۔"
        sd_detail = "⚠️ Gemini API نقص 429: API ڪوٽا ختم ٿي ويو آهي يا حد تائين پهچي ويو آهي. توهان کي انتظار ڪرڻو پوندو."
        pa_detail = "⚠️ Gemini API خرابی 429: API کوٹا ختم ہو گیا اے یا حد تک پہنچ گیا اے۔ تہانوں انتظار کرنا پوے گا۔"
        ps_detail = "⚠️ Gemini API تېروتنه 429: د API کوټه ختمه شوه یا د حد پورې رسیدلې. تاسو باید انتظار وکړئ."

    elif "401" in error_str or "403" in error_str or "permission" in error_lower or "api_key_invalid" in error_lower or "invalid api key" in error_lower:
        error_type = "auth"
        en_detail = f"⚠️ Gemini API Auth Error: API key is invalid, expired, or lacks permissions. Please check your .env file."
        ur_detail = "⚠️ Gemini API تصدیق خرابی: API کلید غلط، ختم شدہ، یا اجازتیں نہیں ہیں۔ براہ کرم اپنی .env فائل چیک کریں۔"
        sd_detail = "⚠️ Gemini API تصديق نقص: API ڪلي غلط آهي يا ختم ٿي وئي آهي. مهرباني ڪري پنهنجي .env فائل چيڪ ڪريو."
        pa_detail = "⚠️ Gemini API تصدیق خرابی: API کلید غلط اے یا ختم ہو گئی اے۔ مہربانی نال اپنی .env فائل چیک کرو۔"
        ps_detail = "⚠️ Gemini API تصدیق تېروتنه: API کلید غلطه ده یا ختمه شوې ده. .env فایل وګورئ."

    elif "400" in error_str or "invalid_argument" in error_lower or "bad request" in error_lower:
        error_type = "bad_request"
        en_detail = f"⚠️ Gemini API Error 400: Bad request. The input may be too long or contain unsupported content."
        ur_detail = "⚠️ Gemini API خرابی 400: غلط درخواست۔ ان پٹ بہت لمبا یا غیر معاون مواد ہو سکتا ہے۔"
        sd_detail = "⚠️ Gemini API نقص 400: غلط درخواست. اِن پُٽ تمام ڊگهو يا غير معاون مواد ٿي سگهي ٿو."
        pa_detail = "⚠️ Gemini API خرابی 400: غلط درخواست۔ اِن پُٹ بہت لمبا یا غیر معاون مواد ہو سکدا اے۔"
        ps_detail = "⚠️ Gemini API تېروتنه 400: غلط غوښتنه. ان پوټ ډېر اوږد یا غیر ملاتړ شوی مواد وي."

    elif "timeout" in error_lower or "timed out" in error_lower or "deadline" in error_lower:
        error_type = "timeout"
        en_detail = f"⚠️ Gemini API Timeout: The request took too long. The model may be slow or the network is unstable."
        ur_detail = "⚠️ Gemini API ٹائم آؤٹ: درخواست میں بہت وقت لگا۔ ماڈل سست ہو سکتا ہے یا نیٹ ورک غیر مستحکم ہے۔"
        sd_detail = "⚠️ Gemini API ٽائيم آئوٽ: درخواست ۾ تمام وقت لڳو. ماڊل سست ٿي سگهي ٿو يا نيٽ ورڪ غير مستحڪم آهي."
        pa_detail = "⚠️ Gemini API ٹائم آؤٹ: درخواست وچ بہت ویلا لگا۔ ماڈل سست ہو سکدا اے یا نیٹ ورک غیر مستحکم اے۔"
        ps_detail = "⚠️ Gemini API ټایم آوټ: غوښتنه ډېره وخت واخیسته. ماډل ورو وي یا شبکه بې ثباته وي."

    elif "connection" in error_lower or "network" in error_lower or "unreachable" in error_lower or "dns" in error_lower:
        error_type = "network"
        en_detail = f"⚠️ Network Error: Cannot reach the Gemini API. Check your internet connection."
        ur_detail = "⚠️ نیٹ ورک خرابی: Gemini API تک رسائی نہیں ہو سکتی۔ اپنا انٹرنیٹ کنکشن چیک کریں۔"
        sd_detail = "⚠️ نيٽ ورڪ نقص: Gemini API تائين رسائي نه ٿي سگهي. پنهنجو انٽرنيٽ ڪنيڪشن چيڪ ڪريو."
        pa_detail = "⚠️ نیٹ ورک خرابی: Gemini API تک رسائی نئیں ہو سکدی۔ اپنا انٹرنیٹ کنکشن چیک کرو۔"
        ps_detail = "⚠️ شبکې تېروتنه: Gemini API ته لاسرسی نشته. خپل انټرنیټ اتصال وګورئ."

    else:
        # Unknown error — show raw details
        error_type = "unknown"
        en_detail = f"⚠️ Gemini API Error: {error_str[:200]}"
        ur_detail = f"⚠️ Gemini API خرابی: {error_str[:200]}"
        sd_detail = f"⚠️ Gemini API نقص: {error_str[:200]}"
        pa_detail = f"⚠️ Gemini API خرابی: {error_str[:200]}"
        ps_detail = f"⚠️ Gemini API تېروتنه: {error_str[:200]}"

    # Select language-appropriate message
    lang_lower = target_lang.lower()
    if lang_lower == "english":
        return en_detail
    elif lang_lower == "urdu":
        return ur_detail
    elif lang_lower == "sindhi":
        return sd_detail
    elif lang_lower == "punjabi":
        return pa_detail
    elif lang_lower == "pashto":
        return ps_detail
    else:
        # Fallback: show both Urdu and English
        return f"{ur_detail}\n\n{en_detail}"


_LAST_TRANSLATE_LOGS: list[str] = []


def get_last_translate_logs() -> list[str]:
    return list(_LAST_TRANSLATE_LOGS)


def translate_text(
    text: str,
    target_lang: str,
    *,
    thinking: bool = False,
    progress_callback: Optional[Callable[[str], None]] = None,
    log_callback: Optional[Callable[[str], None]] = None,
) -> str:
    """
    Generate a short, professional agricultural expert response using Gemini.
    """
    if not text:
        return ""

    target_lang_readable = _normalize_target_lang(target_lang)
    model_name = getattr(config, "GEMINI_MODEL_NAME", "gemini-2.0-flash")

    # === PROFESSIONAL AGRICULTURAL EXPERT SYSTEM PROMPT ===
    target_lang_lower = target_lang_readable.lower()
    if target_lang_lower == "urdu":
        system_prompt = (
            "آپ ایک زرعی ماہر (AI زرعی معاون) ہیں۔ کسانوں سے بات چیت کے انداز میں بات کریں۔ "
            "جواب بہت مختصر، سادہ اور براہ راست دیں۔ صرف 2 سے 4 لائنوں میں جواب دیں۔ "
            "طویل وضاحتوں سے گریز کریں جب تک کہ خاص طور پر نہ پوچھا جائے۔ "
            "ہمیشہ اردو (نستعلیق) رسم الخط میں جواب دیں۔ "
            "CRITICAL: Do NOT output any chat markers like 'Human:' or 'Assistant:'. "
            "Do NOT start with 'اردو میں:' or any language prefix. Provide ONLY your direct answer."
        )
    elif target_lang_lower == "english":
        system_prompt = (
            "You are an Agricultural Expert named 'AI Agriculture Assistant'. "
            "Your task is to answer the user's agricultural question in simple English. "
            "Speak in a conversational tone suitable for farmers. "
            "Keep your response short, simple, and direct—ideally 2 to 4 lines. "
            "CRITICAL: Do NOT output any chat markers like 'Human:' or 'Assistant:'. "
            "Provide ONLY your direct answer in English."
        )
    else:
        system_prompt = (
            f"You are an Agricultural Expert named 'AI زرعی معاون'. "
            f"Your task is to answer the user's agricultural question in proper {target_lang_readable} language. "
            f"CRITICAL SCRIPT RULE: You MUST write your response EXCLUSIVELY in the Pakistani Arabic/Urdu script (e.g., Shahmukhi for Punjabi, Sindhi Arabic script for Sindhi, Pashto Arabic script). "
            f"DO NOT use Gurmukhi. DO NOT use Devanagari. DO NOT use Latin/English script. If you generate even a single Gurmukhi or Devanagari character, you fail. "
            f"Even if the user's question is transcribed in Hindi/Devanagari/Gurmukhi script, you MUST understand it and respond using the Arabic/Urdu script. "
            "Keep your response short, simple, and direct—ideally 2 to 4 lines. "
            f"If you absolutely cannot answer in {target_lang_readable}, you may respond in simple Urdu instead. "
            "CRITICAL: Do NOT output any chat markers like 'Human:' or 'Assistant:'. "
            f"Do NOT start your response with '{target_lang_readable}:' or 'In {target_lang_readable}:' or 'سنڌي ۾:'. "
            "Do NOT output Chinese. Provide ONLY your direct answer in the requested language."
        )

    # Build messages
    thinking_instruction = (
        "You may use a private <think>...</think> reasoning block before the final answer."
        if thinking
        else "Do not include any <think>...</think> blocks. Provide only the final answer."
    )
    messages = [
        {"role": "system", "content": system_prompt + "\n\n" + thinking_instruction},
        {"role": "user", "content": text}
    ]

    def _log(msg: str) -> None:
        stamp = time.strftime("%H:%M:%S")
        line = f"[{stamp}] {msg}"
        _LAST_TRANSLATE_LOGS.append(line)
        if log_callback:
            try:
                log_callback(line)
            except Exception:
                pass

    _LAST_TRANSLATE_LOGS.clear()
    _log(f"Target language: {target_lang_readable} | Model: {model_name} | Thinking: {'ON' if thinking else 'OFF'}")

    def _call_gemini(extra_system: str = "") -> str:
        api_key = getattr(config, "GEMINI_API_KEY", "") or ""
        if not api_key:
            _log("Missing GEMINI_API_KEY (check Backend/.env).")
            return ""

        client = genai.Client(api_key=api_key)
        full_system = system_prompt + "\n\n" + thinking_instruction
        if extra_system:
            full_system = full_system + "\n\n" + extra_system

        cfg = GenerateContentConfig(
            system_instruction=full_system,
            temperature=0.45,
            top_p=0.9,
        )

        # Try primary model, then fallback on 503/overload
        models_to_try = [model_name]
        fallback = "gemini-2.0-flash"
        if model_name != fallback:
            models_to_try.append(fallback)

        last_error = None
        for attempt_model in models_to_try:
            for attempt in range(2):  # retry once per model
                try:
                    _log(f"Calling {attempt_model} (attempt {attempt + 1})…")
                    resp = client.models.generate_content(model=attempt_model, contents=text, config=cfg)
                    out = (getattr(resp, "text", None) or "").strip()
                    if progress_callback:
                        try:
                            progress_callback(out)
                        except Exception:
                            pass
                    _log(f"Done. Received {len(out)} characters from {attempt_model}.")
                    return out
                except Exception as e:
                    last_error = e
                    err_str = str(e).lower()
                    is_retryable = any(k in err_str for k in ["503", "unavailable", "overloaded", "high demand", "429", "resource_exhausted"])
                    _log(f"{attempt_model} attempt {attempt + 1} failed: {e}")
                    if is_retryable and attempt == 0:
                        wait_secs = 2
                        _log(f"Retryable error. Waiting {wait_secs}s before retry…")
                        time.sleep(wait_secs)
                        continue
                    break  # Non-retryable or second attempt failed, try next model

        # All models/retries exhausted — raise last error for the outer handler
        if last_error:
            raise last_error
        return ""

    try:
        translated_text = _call_gemini()

        if not translated_text:
            return "[معذرت، مجھے آپ کی بات سمجھ نہیں آئی۔ براہ کرم دوبارہ کوشش کریں۔]"

        cleaned = _strip_qwen_thinking_blocks(translated_text)
        if not thinking and not cleaned and "<think" in translated_text.lower():
            translated_text = _call_gemini(
                extra_system=(
                    "CRITICAL: Return ONLY the final answer text. "
                    "Do NOT output <think> tags or any reasoning."
                )
            )
            if not translated_text:
                return "[معذرت، مجھے آپ کی بات سمجھ نہیں آئی۔ براہ کرم دوبارہ کوشش کریں۔]"
            cleaned = _strip_qwen_thinking_blocks(translated_text)

        final_text = cleaned or translated_text
        final_text = _strip_hallucinations(final_text)
        
        # If the text became empty after stripping hallucinations, provide a fallback.
        if not final_text:
            return "[معذرت، مجھے آپ کی بات سمجھ نہیں آئی۔ براہ کرم دوبارہ کوشش کریں۔]"

        # Check for Gurmukhi or Devanagari characters
        def _has_invalid_script(text: str) -> bool:
            for char in text:
                if '\u0A00' <= char <= '\u0A7F' or '\u0900' <= char <= '\u097F':
                    return True
            return False

        if _has_invalid_script(final_text):
            _log("Detected Gurmukhi or Devanagari in output. Retrying with strict script enforcement...")
            retry_text = _call_gemini(
                extra_system=(
                    "CRITICAL ERROR: Your previous response contained Gurmukhi or Devanagari script. "
                    "You MUST rewrite the response using ONLY the Pakistani Arabic/Urdu script (Shahmukhi). "
                    "Output ONLY the corrected text."
                )
            )
            if retry_text:
                cleaned_retry = _strip_hallucinations(_strip_qwen_thinking_blocks(retry_text))
                final_text = cleaned_retry or retry_text

        return _sanitize_translated_text(final_text)

    except Exception as e:
        error_str = str(e)
        _log(f"Gemini error: {error_str}")

        # ── Build a detailed, language-aware error message ──
        error_detail = _build_detailed_error(error_str, target_lang_readable)
        return error_detail



def normalize_transcript_for_display(text: str, target_lang: str) -> str:
    """
    Normalizes transcribed text (e.g., Roman Urdu, Devanagari Sindhi/Punjabi)
    into the native Perso-Arabic script for the target language.
    Does NOT answer the prompt—just transliterates/corrects the script.
    """
    if not text:
        return text

    target_lang_readable = _normalize_target_lang(target_lang)
    model_name = getattr(config, "GEMINI_MODEL_NAME", "gemini-2.5-flash")

    system_prompt = (
        f"You are a transliteration engine. Your task is to accurately convert the user's spoken {target_lang_readable} text "
        f"into its proper native Arabic/Perso-Arabic script. "
        "The input might be in Latin/Roman script, Devanagari script, or an imperfect transcription. "
        "DO NOT answer any questions or add any conversational text. "
        "ONLY output the exact same meaning in the proper Arabic/Perso-Arabic script. "
        f"For example, if the target is Sindhi and input is in Devanagari, rewrite it in proper Sindhi Arabic script. "
        "CRITICAL: Output ONLY the translated/transliterated text. No prefixes, no explanations."
    )

    def _call_gemini() -> str:
        api_key = getattr(config, "GEMINI_API_KEY", "") or ""
        if not api_key:
            return text

        client = genai.Client(api_key=api_key)
        cfg = GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.1, # Low temp for transliteration
        )
        models_to_try = [model_name]
        fallback = "gemini-2.0-flash"
        if model_name != fallback:
            models_to_try.append(fallback)

        for attempt_model in models_to_try:
            try:
                resp = client.models.generate_content(model=attempt_model, contents=text, config=cfg)
                out = (getattr(resp, "text", None) or "").strip()
                return out
            except Exception as e:
                _LAST_TRANSLATE_LOGS.append(f"Normalization error ({attempt_model}): {e}")
                continue
        return ""

    normalized = _call_gemini()
    if not normalized:
        return text
    
    cleaned = _strip_hallucinations(_strip_qwen_thinking_blocks(normalized))
    return cleaned if cleaned else text


def transliterate_regional_for_tts(text: str, target_lang: str) -> str:
    """
    Transliterates proper regional Arabic scripts (Sindhi, Pashto, Balochi, etc.)
    into standard Urdu letters. This allows the Urdu TTS engine to pronounce
    the regional text phonetically without failing on unknown characters.
    """
    if not text:
        return text

    target_lang_readable = _normalize_target_lang(target_lang)
    model_name = getattr(config, "GEMINI_MODEL_NAME", "gemini-2.5-flash")
    system_prompt = (
        f"You are a phonetic transliteration engine. The user will provide text in {target_lang_readable} language (Arabic script). "
        "Your task is to rewrite the text using ONLY standard Urdu letters so that an Urdu Text-to-Speech (TTS) "
        "engine can pronounce it correctly. "
        "Replace any language-specific special letters (e.g., Sindhi's ٻ, ڄ, ڳ, or Pashto's ښ, ږ, څ) with their closest Urdu phonetic equivalents. "
        "DO NOT translate the meaning to Urdu. Keep the original words, just write them using the standard Urdu alphabet. "
        "CRITICAL: Output ONLY the transliterated text. Do NOT add explanations or prefixes."
    )

    def _call_gemini() -> str:
        api_key = getattr(config, "GEMINI_API_KEY", "") or ""
        if not api_key:
            return text

        client = genai.Client(api_key=api_key)
        cfg = GenerateContentConfig(
            system_instruction=system_prompt,
            temperature=0.1,
        )
        models_to_try = [model_name]
        fallback = "gemini-2.0-flash"
        if model_name != fallback:
            models_to_try.append(fallback)

        for attempt_model in models_to_try:
            try:
                resp = client.models.generate_content(model=attempt_model, contents=text, config=cfg)
                out = (getattr(resp, "text", None) or "").strip()
                return out
            except Exception as e:
                _LAST_TRANSLATE_LOGS.append(f"TTS Transliteration error ({attempt_model}): {e}")
                continue
        return ""

    transliterated = _call_gemini()
    if not transliterated:
        return text
    
    cleaned = _strip_hallucinations(_strip_qwen_thinking_blocks(transliterated))
    return cleaned if cleaned else text


__all__ = ["translate_text", "get_last_translate_logs", "normalize_transcript_for_display", "transliterate_regional_for_tts"]