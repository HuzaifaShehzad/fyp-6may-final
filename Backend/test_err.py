import translate
import json

res = translate.translate_text('Hello', 'urdu')
logs = translate.get_last_translate_logs()

with open('test_err.txt', 'w', encoding='utf-8') as f:
    f.write(json.dumps(logs, indent=2))
