/**
 * Simulated AI responses for the Agriculture Assistant.
 * These are categorized by topic keywords for more realistic matching.
 * Responses use markdown formatting for structured display.
 */

// Keyword-based response mapping for intelligent matching
export const keywordResponses = {
  // Crop-related queries
  crop: [
    "Based on the current season and soil conditions, I'd recommend:\n\n**Top Crop Recommendations:**\n- 🌾 **Wheat** — Ideal for Rabi season (Oct–Mar)\n- 🌾 **Rice** — Thrives in Kharif season (Jun–Sep)\n- 🌽 **Maize** — Versatile, grows in both seasons\n\n> Consider your **local climate** and **water availability** for the best results. Always test soil pH before planting.",
    "For maximum yield, practice **crop rotation**:\n\n| Season | Crop Type | Examples |\n|--------|-----------|----------|\n| Rabi | Cereals | Wheat, Barley |\n| Kharif | Legumes | Chickpeas, Lentils |\n| Summer | Cash Crops | Cotton, Sugarcane |\n\nLegumes like chickpeas **fix nitrogen naturally**, benefiting the next crop cycle.",
    "The best crops for this season depend on your region:\n\n1. **Punjab** — Wheat and Sugarcane\n2. **Sindh** — Cotton and Rice\n3. **KPK** — Maize and Tobacco\n4. **Balochistan** — Fruits and Dates\n\n⚠️ Always test your **soil pH** before planting for optimal results."
  ],

  // Weather-related queries
  weather: [
    "**Weather Advisory for Farmers** 🌤️\n\nCurrent seasonal outlook:\n- **Temperature:** Moderate, ideal for wheat cultivation\n- **Rainfall:** Expected moderate this month\n- **Risk:** Unexpected frost possible in northern regions\n\n**Protective Measures:**\n1. Use **mulching techniques** against frost\n2. Install **rain gauges** for accurate measurement\n3. Ensure proper **field drainage** to prevent waterlogging",
    "**Temperature Management Tips:**\n\n| Condition | Solution |\n|-----------|----------|\n| Extreme Heat | Use shade nets |\n| Cold Snaps | Apply frost covers |\n| Heavy Rain | Improve drainage |\n| Drought | Drip irrigation |\n\n💡 **Pro Tip:** Monitor weather apps daily to plan irrigation schedules effectively.",
    "**Seasonal Rainfall Forecast:**\n\n- Expected **moderate rainfall** this month\n- Ensure proper drainage in your fields\n- Consider installing **rain gauges** for measurement\n\n**Action Items:**\n1. Check local forecasts daily\n2. Prepare drainage channels\n3. Stock mulching materials\n4. Plan irrigation schedules around rainfall"
  ],

  // Fertilizer-related queries
  fertilizer: [
    "**Fertilizer Guide for Wheat** 🧪\n\n| Stage | Fertilizer | Rate |\n|-------|-----------|------|\n| At Sowing | DAP (Di-Ammonium Phosphate) | 50 kg/acre |\n| After 1st Irrigation | Urea (Top-dressing) | 50 kg/acre |\n| Tillering Stage | Potash | 25 kg/acre |\n\n⚠️ **Important:** Always conduct a **soil test** before applying fertilizers.",
    "**Organic Fertilizer Options:**\n\n1. **Compost** — Improves soil structure\n2. **Vermicompost** — Rich in micronutrients\n3. **Farmyard Manure** — 2-3 tonnes/acre before sowing\n4. **Green Manure** — Boosts microbial activity\n\n> Mix well-decomposed organic matter into soil **2-3 weeks before sowing** for best results.",
    "**NPK Ratio Guide:**\n\n- **N (Nitrogen)** → Promotes leaf growth 🌿\n- **P (Phosphorus)** → Strengthens roots 🌱\n- **K (Potassium)** → Enhances disease resistance 🛡️\n\n**Recommended Ratios:**\n| Crop Type | NPK Ratio |\n|-----------|----------|\n| Vegetables | 20-20-20 |\n| Cereals | 46-0-0 (Urea) |\n| Fruits | 12-32-16 |"
  ],

  // Pest-related queries
  pest: [
    "**Integrated Pest Management (IPM)** 🐛\n\nA step-by-step approach:\n\n1. **Biological Control** — Use ladybugs for aphids\n2. **Natural Pesticide** — Neem oil spray (5ml/liter)\n3. **Chemical Control** — Last resort only\n\n**Natural Remedies:**\n- Neem oil spray for sucking pests\n- *Bacillus thuringiensis* (Bt) for caterpillars\n- Garlic-chili spray for general deterrence\n\n⏰ Apply **early morning** or **late evening** for best results.",
    "**Common Pests This Season:**\n\n| Pest | Damage | Control |\n|------|--------|---------|\n| Aphids | Suck plant sap | Ladybugs, Neem oil |\n| Whiteflies | Leaf yellowing | Yellow sticky traps |\n| Stem Borers | Hollow stems | Trichogramma wasps |\n| Armyworms | Leaf defoliation | Bt spray |\n\n💡 **Early Detection:** Regularly inspect leaves (especially undersides) for signs of infestation.",
    "**Organic Pest Control Recipes:**\n\n1. **Neem Oil Spray**\n   - 5ml neem oil + 1L water + few drops soap\n   - Apply every 7-10 days\n\n2. **Garlic-Chili Spray**\n   - Blend 10 garlic cloves + 4 hot peppers\n   - Strain and dilute in 2L water\n\n3. **Bt (Bacillus thuringiensis)**\n   - Follow package instructions\n   - Effective against caterpillars only"
  ],

  // Locust-specific (for demo scenarios)
  locust: [
    "**🦗 Locust Prevention & Management**\n\nLocust swarms can devastate crops within hours. Here's your action plan:\n\n**Immediate Steps:**\n1. **Report sightings** to your local agriculture department\n2. **Monitor** early morning when locusts are less active\n3. **Create noise barriers** using drums and horns\n\n**Chemical Control:**\n| Pesticide | Application | Coverage |\n|-----------|------------|----------|\n| Malathion 96% | ULV Spray | 1-2 L/ha |\n| Lambda-cyhalothrin | Boom Sprayer | 400-600 L/ha |\n| Chlorpyrifos 20EC | Tractor spray | 600 L/ha |\n\n**Prevention:**\n- Plant **early maturing varieties** to avoid peak locust season\n- Create **buffer zones** around vulnerable crops\n- Join local **WhatsApp alert groups** for early warnings\n\n⚠️ **Critical:** Always wear protective gear during pesticide application."
  ],

  // Potato blight specific (for demo voice scenario)
  potato: [
    "**🥔 Potato Blight Treatment Guide**\n\nPotato blight (Late Blight - *Phytophthora infestans*) is one of the most destructive diseases.\n\n**Identification:**\n- Dark brown/black spots on leaves\n- White fuzzy growth on leaf undersides\n- Rapid wilting in humid conditions\n\n**Treatment Plan:**\n\n| Stage | Action | Product |\n|-------|--------|---------|\n| Early | Preventive spray | Mancozeb 75% WP |\n| Active | Curative spray | Metalaxyl + Mancozeb |\n| Severe | Systemic fungicide | Cymoxanil + Mancozeb |\n\n**Application Schedule:**\n1. First spray at **45 days** after planting\n2. Repeat every **7-10 days** during wet weather\n3. Stop spraying **14 days** before harvest\n\n**Prevention Tips:**\n- Use **certified disease-free** seed potatoes\n- Ensure proper **spacing** (60cm × 25cm)\n- Avoid **overhead irrigation**\n- Remove and burn **infected plants** immediately"
  ],

  // Disease-related queries
  disease: [
    "**Plant Disease Identification Guide** 🔍\n\n| Symptom | Likely Cause | Action |\n|---------|-------------|--------|\n| Yellowing leaves | Nutrient deficiency or virus | Soil test, check for pests |\n| Brown spots | Fungal infection | Apply fungicide |\n| Wilting | Bacterial wilt | Remove affected plants |\n| White powder | Powdery mildew | Sulfur spray |\n\n📋 Send leaf samples to your local agriculture extension office for **accurate diagnosis**.",
    "**Wheat Leaf Rust Management:**\n\n1. **Plant resistant varieties** (recommended)\n2. Apply **Propiconazole** at 1ml/liter\n3. Spray at first sign of orange-brown pustules\n4. Monitor fields every **3-5 days** during high-risk period\n\n**Prevention Checklist:**\n- ✅ Crop rotation\n- ✅ Disease-free seeds\n- ✅ Proper plant spacing\n- ✅ Avoid overhead irrigation",
    "**Disease Prevention Best Practices:**\n\n1. **Crop Rotation** — Break disease cycles\n2. **Clean Seeds** — Use certified disease-free varieties\n3. **Air Circulation** — Maintain proper plant spacing\n4. **Smart Irrigation** — Avoid overhead watering\n5. **Sanitation** — Remove plant debris after harvest\n\n> 💡 Prevention is always **cheaper and more effective** than treatment!"
  ],

  // Soil-related queries
  soil: [
    "**Soil Health Assessment Guide** 🧪\n\nHealthy soil = Healthy crops. Here's what to test:\n\n| Parameter | Ideal Range | Why It Matters |\n|-----------|------------|----------------|\n| pH | 6.0 - 7.5 | Nutrient availability |\n| Nitrogen (N) | 250-500 kg/ha | Leaf growth |\n| Phosphorus (P) | 20-25 kg/ha | Root development |\n| Potassium (K) | 150-200 kg/ha | Disease resistance |\n| Organic Matter | >2% | Soil structure |\n\n🏢 Your local agriculture office provides **affordable soil testing kits**.",
    "**Soil Improvement Guide:**\n\n**For Clay Soil:**\n- Add compost and rice husks\n- Practice deep plowing\n- Use green manure crops\n\n**For Sandy Soil:**\n- Incorporate clay particles\n- Add organic matter generously\n- Use mulching to retain moisture\n\n**For All Soils:**\n- Regular organic matter addition\n- Avoid over-tilling\n- Maintain cover crops in off-seasons",
    "**Soil Erosion Prevention:**\n\n1. **Contour Farming** on slopes\n2. **Cover Crops** during off-seasons\n3. **Vegetative Buffer Strips** along waterways\n4. **Mulching** to protect topsoil\n5. **Reduced Tillage** to maintain structure\n\n> These practices preserve **topsoil and nutrients** for future generations."
  ],

  // Irrigation/water-related queries
  water: [
    "**Smart Irrigation Guide** 💧\n\n| Method | Water Savings | Best For |\n|--------|-------------|----------|\n| Drip Irrigation | Up to 60% | Vegetables, Fruits |\n| Sprinkler | Up to 30% | Field crops |\n| Furrow | Moderate | Row crops |\n| Flood | Baseline | Rice paddies |\n\n**Best Practices:**\n- Water during **early morning** or **late evening**\n- Most crops need **1-2 inches/week**\n- Use a **soil moisture meter** to avoid over/under-watering",
    "**Rainwater Harvesting for Farms:**\n\n1. Build **farm ponds** to collect monsoon water\n2. Install **rooftop collection** for farmhouses\n3. Create **check dams** for watershed management\n\n**Benefits:**\n- ✅ Reduces dependence on groundwater\n- ✅ Free water source during dry periods\n- ✅ Recharges local water table\n- ✅ Government subsidies often available"
  ],

  // Seed-related queries
  seed: [
    "**Seed Selection Guide** 🌱\n\n**Always use certified seeds!**\n\n| Factor | What to Check |\n|--------|---------------|\n| Germination Rate | Should be 95%+ |\n| Purity | 98%+ seed purity |\n| Moisture | Below 12% |\n| Expiry Date | Current season |\n| Lot Number | For traceability |\n\n**Seed Treatment:**\n- Fungicide: Carbendazim (2g/kg seed)\n- Organic: *Trichoderma viride*\n- Apply treatment **1-2 days** before sowing",
    "**Seed Storage Tips:**\n\n1. Cool, dry place (below 25°C)\n2. Moisture content below 12%\n3. Airtight containers\n4. Add silica gel packets\n5. Check every 3 months\n\n> Properly stored seeds remain viable for **2-3 years**."
  ],

  // Harvest-related queries
  harvest: [
    "**Harvest Timing Guide** 🌾\n\n| Crop | Optimal Moisture | Method |\n|------|-----------------|--------|\n| Wheat | 14-16% | Combine harvester |\n| Rice | 20-24% | Manual/Machine |\n| Cotton | When bolls open | Hand-picking |\n| Sugarcane | Before flowering | Machine cutting |\n\n💡 **Pro Tip:** Use a moisture meter for accurate readings. Harvesting too early or late **reduces quality and price**.",
    "**Post-Harvest Loss Prevention:**\n\n1. **Proper Drying** — Reduce moisture to safe levels\n2. **Cleaning** — Remove debris and broken grains\n3. **Hermetic Storage** — Use sealed bags against insects\n4. **Temperature** — Keep below 15°C\n5. **Humidity** — Maintain below 65%\n\nFor fruits & vegetables:\n- Harvest during **cooler parts** of the day\n- Handle gently to **minimize bruising**\n- **Pre-cool** produce quickly to extend shelf life"
  ],

  // Market/price-related queries
  market: [
    "**Market Strategy for Farmers** 📊\n\n**Maximize Your Profits:**\n\n1. **Check Mandi Prices** daily before selling\n2. **Grade your produce** — sorted produce fetches 15-20% more\n3. **Direct selling** at farmer markets increases profit by 30-50%\n4. **Value Addition** — packaging and branding\n\n| Strategy | Profit Increase |\n|----------|----------------|\n| Grading | +15-20% |\n| Packaging | +10-15% |\n| Direct Sale | +30-50% |\n| Branding | +20-40% |",
    "**Farmer Producer Organization (FPO) Benefits:**\n\n- ✅ Better price negotiation\n- ✅ Reduced marketing costs\n- ✅ Access to larger markets\n- ✅ Government scheme benefits\n- ✅ Bulk input purchasing discounts\n\n> **Diversify crops** to reduce market risk. Growing both food and cash crops provides **income stability**."
  ],

  // Greeting responses
  hello: [
    "**Hello! 🌾 Welcome to AI Agriculture Assistant**\n\nI'm here to help you with:\n\n- 🌿 **Crop Selection** — Best crops for your region\n- 🐛 **Pest Management** — Identify and control pests\n- 🧪 **Soil & Fertilizer** — Testing and recommendations\n- 💧 **Irrigation** — Smart water management\n- 🌤️ **Weather** — Forecasts and advisory\n- 📊 **Market Prices** — Latest crop rates\n\nHow can I assist you today?",
    "**Assalam-o-Alaikum! 🌿**\n\nI'm your AI farming assistant. Feel free to ask me anything about:\n- Crop selection and rotation\n- Pest and disease management\n- Fertilizer recommendations\n- Weather and irrigation\n- Market information\n\nWhat would you like to know?",
    "**Hi there, farmer! 🌱**\n\nI'm ready to help with all your agricultural questions. Whether it's about soil health, crop diseases, or market prices — just ask away!\n\n> Tip: Try the **quick action buttons** above the input box for common queries!"
  ],

  // Thank you responses
  thank: [
    "You're welcome! 🌾 Happy to help with your farming needs. Remember, **good farming practices lead to great harvests**. Feel free to ask anything else!",
    "Glad I could help! 🌿 **Sustainable farming** is the key to prosperity. Don't hesitate to come back with more questions.",
    "My pleasure! 🌱 Wishing you a **bountiful harvest**. I'm always here if you need more farming advice."
  ]
};

// Urdu responses for bilingual support
export const urduResponses = {
  crop: [
    "**موجودہ موسم کے لیے فصل کی سفارشات:**\n\n| موسم | فصل | مدت |\n|------|------|------|\n| ربیع | گندم، جو | اکتوبر - مارچ |\n| خریف | چاول، مکئی | جون - ستمبر |\n| زائد | سبزیاں | سارا سال |\n\n🌾 اپنے علاقے کی آب و ہوا اور پانی کی دستیابی کو مدنظر رکھیں۔",
    "زیادہ سے زیادہ پیداوار کے لیے، **فصل کی گردش** کی مشق کریں۔ مٹی کی زرخیزی برقرار رکھنے کے لیے دالوں اور اناج کو باری باری لگائیں۔"
  ],
  weather: [
    "**موسمی مشاورت** 🌤️\n\n- درجہ حرارت معتدل ہے — گندم کے لیے موزوں\n- بارش کا امکان معتدل ہے\n- غیر متوقع پالے سے بچاؤ کے لیے ملچنگ استعمال کریں\n\n💡 روزانہ موسم کی ایپس چیک کریں۔",
  ],
  fertilizer: [
    "**گندم کے لیے کھاد گائیڈ** 🧪\n\n| مرحلہ | کھاد | مقدار |\n|--------|--------|--------|\n| بوائی | ڈی اے پی | 50 کلو/ایکڑ |\n| پہلی آبپاشی بعد | یوریا | 50 کلو/ایکڑ |\n\n⚠️ ہمیشہ مٹی کا ٹیسٹ کروائیں۔",
  ],
  pest: [
    "**کیڑے مکوڑوں کا انتظام (آئی پی ایم)** 🐛\n\n1. حیاتیاتی کنٹرول سے شروع کریں\n2. نیم کا تیل (5ml/لٹر) استعمال کریں\n3. کیمیائی ادویات آخری حربہ ہوں\n\n⏰ صبح سویرے یا شام کو سپرے کریں۔",
  ],
  hello: [
    "**السلام علیکم! 🌾**\n\nاے آئی زرعی معاون میں خوش آمدید۔ میں آپ کی مدد کر سکتا ہوں:\n\n- 🌿 فصل کا انتخاب\n- 🐛 کیڑوں کا انتظام\n- 🧪 مٹی اور کھاد\n- 💧 آبپاشی\n- 📊 مارکیٹ قیمتیں\n\nآج میں آپ کی کیا مدد کر سکتا ہوں؟",
  ],
  thank: [
    "آپ کا شکریہ! 🌾 آپ کی کھیتی باڑی کی ضروریات میں مدد کر کے خوشی ہوئی۔ بے شک پوچھیں اگر کوئی اور سوال ہو!",
  ],
  potato: [
    "**🥔 آلو کی بلائیٹ کا علاج**\n\n**شناخت:**\n- پتوں پر گہرے بھورے/کالے دھبے\n- پتوں کے نیچے سفید پھپھوندی\n- نمی میں تیزی سے مرجھانا\n\n**علاج:**\n1. Mancozeb 75% WP — بچاؤ سپرے\n2. Metalaxyl + Mancozeb — فعال انفیکشن\n3. ہر 7-10 دن بعد دہرائیں\n\n⚠️ فصل کاٹنے سے 14 دن پہلے سپرے بند کریں۔"
  ],
  locust: [
    "**🦗 ٹڈی دل سے بچاؤ**\n\n**فوری اقدامات:**\n1. مقامی محکمہ زراعت کو اطلاع دیں\n2. صبح سویرے نگرانی کریں\n3. آواز کی رکاوٹیں بنائیں\n\n**کیمیائی کنٹرول:**\n- Malathion 96% — ULV سپرے\n- Lambda-cyhalothrin — بوم سپریئر\n\n⚠️ سپرے کے دوران حفاظتی لباس ضرور پہنیں۔"
  ],
  default: [
    "یہ ایک اچھا سوال ہے! زراعت میں، ہمیشہ اپنے مقامی زرعی توسیعی دفتر سے مشورہ کرنا بہتر ہے۔ میں عمومی رہنمائی فراہم کر سکتا ہوں۔ براہ کرم اپنا سوال مزید تفصیل سے بتائیں۔",
  ]
};

// ─── Sindhi responses ────────────────────────────────────────
export const sindhiResponses = {
  crop: [
    "**هن موسم لاءِ فصل جون صلاحون:**\n\n| موسم | فصل | مدت |\n|------|------|------|\n| ربيع | ڪنک، جو | آڪٽوبر - مارچ |\n| خريف | چانور، مڪئي | جون - سيپٽمبر |\n| اضافي | سبزيون | سڄو سال |\n\n🌾 پنهنجي علائقي جي آبهوا ۽ پاڻي جي فراهمي کي نظر ۾ رکو۔",
    "وڌ کان وڌ پيداوار لاءِ، **فصل جي ردوبدل** جي مشق ڪريو۔ مٽي جي زرخيزي برقرار رکڻ لاءِ دالهن ۽ اناج کي باري باري لڳايو۔"
  ],
  weather: [
    "**موسمي مشاورت** 🌤️\n\n- درجه حرارت معتدل آهي — ڪنک لاءِ مناسب\n- برسات جو اميد معتدل آهي\n- غير متوقع ٿڻي کان بچاءُ لاءِ ملچنگ استعمال ڪريو\n\n💡 روزانه موسم جون ايپس چيڪ ڪريو۔",
  ],
  fertilizer: [
    "**ڪنک لاءِ کاد گائيڊ** 🧪\n\n| مرحلو | کاد | مقدار |\n|--------|--------|--------|\n| ٻوائي | ڊي اي پي | 50 ڪلو/ايڪڙ |\n| پهرين پاڻي ڏيڻ بعد | يوريا | 50 ڪلو/ايڪڙ |\n\n⚠️ هميشه مٽي جو ٽيسٽ ڪرايو۔",
  ],
  pest: [
    "**ڪيڙن جو انتظام (آئي پي ايم)** 🐛\n\n1. حياتياتي ڪنٽرول کان شروع ڪريو\n2. نيم جو تيل (5ml/لٽر) استعمال ڪريو\n3. ڪيميائي دوائون آخري حربو هجن\n\n⏰ صبح سوير يا شام کي سپري ڪريو۔",
  ],
  hello: [
    "**السلام عليڪم! 🌾**\n\nاي آئي زرعي مددگار ۾ ڀلي ڪري آيا۔ مان توهان جي مدد ڪري سگهان ٿو:\n\n- 🌿 فصل جو چونڊ\n- 🐛 ڪيڙن جو انتظام\n- 🧪 مٽي ۽ کاد\n- 💧 پاڻي ڏيڻ\n- 📊 مارڪيٽ قيمتون\n\naڄ مان توهان جي ڇا مدد ڪري سگهان ٿو؟",
  ],
  thank: [
    "توهان جو مهرباني! 🌾 توهان جي ڪاشتڪاري جي ضرورتن ۾ مدد ڪري خوشي ٿي. ضرور پڇو جيڪڏهن ڪو ۽ سوال هجي!",
  ],
  potato: [
    "**🥔 آلو جي بلائيٽ جو علاج**\n\n**سڃاڻپ:**\n- پنن تي ڳاڙها ناسي/ڪارا ڌاٻا\n- پنن جي هيٺان سفيد ڦڦونداٺ\n- نمي ۾ جلدي مرجهائڻ\n\n**علاج:**\n1. Mancozeb 75% WP — بچاءُ سپري\n2. Metalaxyl + Mancozeb — فعال انفيڪشن\n3. هر 7-10 ڏينهن بعد ورجايو\n\n⚠️ فصل ڪٽڻ کان 14 ڏينهن اڳ سپري بند ڪريو۔"
  ],
  locust: [
    "**🦗 ٽڊي دل کان بچاءُ**\n\n**فوري قدم:**\n1. مقامي محڪمه زراعت کي اطلاع ڏيو\n2. صبح سوير نگراني ڪريو\n3. آواز جون رڪاوٽون ٺاهيو\n\n**ڪيميائي ڪنٽرول:**\n- Malathion 96% — ULV سپري\n- Lambda-cyhalothrin — بوم سپريئر\n\n⚠️ سپري دوران حفاظتي لباس ضرور پهريو۔"
  ],
  soil: [
    "**مٽي جي صحت جو جائزو** 🧪\n\nصحتمند مٽي = صحتمند فصل:\n\n| پيراميٽر | مناسب حد | اهميت |\n|-----------|----------|--------|\n| pH | 6.0 - 7.5 | غذائيت جي دستيابي |\n| نائٽروجن | 250-500 ڪلو/هيڪٽر | پن جي واڌاري |\n| فاسفورس | 20-25 ڪلو/هيڪٽر | پاڙن جي واڌاري |\n\n🏢 مقامي محڪمه زراعت مٽي جا سستا ٽيسٽ فراهم ڪري ٿو۔"
  ],
  water: [
    "**سمارٽ پاڻي ڏيڻ جو طريقو** 💧\n\n| طريقو | پاڻي بچت | ڪهڙي فصل لاءِ |\n|--------|----------|--------|\n| ڊرپ | 60% تائين | سبزيون، ميوا |\n| اسپرنڪلر | 30% تائين | فيلڊ فصلون |\n| نالي | معتدل | قطار فصلون |\n\n💡 صبح سوير يا شام جو پاڻي ڏيو۔"
  ],
  disease: [
    "**فصل جي بيماري جي سڃاڻپ** 🔍\n\n| نشاني | ممڪن سبب | عمل |\n|--------|----------|------|\n| پيلا پن | غذائيت جي گهٽتائي | مٽي ٽيسٽ |\n| ناسي ڌاٻا | ڦڦونداٺ | فنگي سائيڊ |\n| مرجهائڻ | بيڪٽيريل ولٽ | متاثر ٻوٽا هٽايو |\n\n📋 پنن جا نمونا مقامي محڪمي ڏانهن موڪليو۔"
  ],
  default: [
    "هيءَ ساراهه وارو سوال آهي! زراعت ۾، هميشه پنهنجي مقامي زرعي اداري کان صلاح وٺڻ بهتر آهي۔ مان عمومي رهنمائي فراهم ڪري سگهان ٿو۔ مهرباني ڪري پنهنجو سوال وڌيڪ تفصيل سان ٻڌايو۔",
  ]
};

// ─── Punjabi responses ───────────────────────────────────────
export const punjabiResponses = {
  crop: [
    "**اس موسم لئی فصل دیاں سفارشاں:**\n\n| موسم | فصل | مدت |\n|------|------|------|\n| ربیع | کنک، جَو | اکتوبر - مارچ |\n| خریف | چول، مکئی | جون - ستمبر |\n| اضافی | سبزیاں | سارا سال |\n\n🌾 اپنے علاقے دی آبوہوا تے پانی دی دستیابی نوں دھیان وچ رکھو۔",
    "ودھ توں ودھ پیداوار لئی، **فصل دی ردوبدل** دی مشق کرو۔ مٹی دی زرخیزی برقرار رکھن لئی دالاں تے اناج نوں باری باری لاؤ۔"
  ],
  weather: [
    "**موسمی مشاورت** 🌤️\n\n- درجہ حرارت معتدل اے — کنک لئی مناسب\n- بارش دا امکان معتدل اے\n- غیر متوقع پالے توں بچاؤ لئی ملچنگ ورتو\n\n💡 روزانہ موسم دیاں ایپس چیک کرو۔",
  ],
  fertilizer: [
    "**کنک لئی کھاد گائیڈ** 🧪\n\n| مرحلہ | کھاد | مقدار |\n|--------|--------|--------|\n| بیجن | ڈی اے پی | 50 کلو/ایکڑ |\n| پہلی پانی دین بعد | یوریا | 50 کلو/ایکڑ |\n\n⚠️ ہمیشہ مٹی دا ٹیسٹ کراؤ۔",
  ],
  pest: [
    "**کیڑیاں دا انتظام (آئی پی ایم)** 🐛\n\n1. حیاتیاتی کنٹرول توں شروع کرو\n2. نیم دا تیل (5ml/لٹر) ورتو\n3. کیمیائی دوائیاں آخری حربہ ہون\n\n⏰ صبح سویرے یا شام نوں سپرے کرو۔",
  ],
  hello: [
    "**السلام علیکم! 🌾**\n\nاے آئی زرعی مددگار وچ خوش آمدید۔ میں تہاڈی مدد کر سکدا آں:\n\n- 🌿 فصل دا چنا\n- 🐛 کیڑیاں دا انتظام\n- 🧪 مٹی تے کھاد\n- 💧 پانی دینا\n- 📊 مارکیٹ قیمتاں\n\nاج میں تہاڈی کیہ مدد کراں؟",
  ],
  thank: [
    "تہاڈا شکریہ! 🌾 تہاڈی کھیتی دیاں ضرورتاں وچ مدد کر کے خوشی ہوئی۔ ضرور پچھو جے کوئی ہور سوال ہووے!",
  ],
  potato: [
    "**🥔 آلو دی بلائیٹ دا علاج**\n\n**پہچان:**\n- پتیاں تے گوڑے بھورے/کالے دھبے\n- پتیاں دے ہیٹھاں سفید پھپھوندی\n- نمی وچ جلدی مرجھانا\n\n**علاج:**\n1. Mancozeb 75% WP — بچاؤ سپرے\n2. Metalaxyl + Mancozeb — فعال انفیکشن\n3. ہر 7-10 دناں بعد دہراؤ\n\n⚠️ فصل وڈھن توں 14 دن پہلاں سپرے بند کرو۔"
  ],
  locust: [
    "**🦗 ٹڈی دل توں بچاؤ**\n\n**فوری قدم:**\n1. مقامی محکمہ زراعت نوں اطلاع دیو\n2. صبح سویرے نگرانی کرو\n3. آواز دیاں رکاوٹاں بناؤ\n\n**کیمیائی کنٹرول:**\n- Malathion 96% — ULV سپرے\n- Lambda-cyhalothrin — بوم سپریئر\n\n⚠️ سپرے دوران حفاظتی لباس ضرور پاؤ۔"
  ],
  soil: [
    "**مٹی دی صحت دا جائزہ** 🧪\n\nصحتمند مٹی = صحتمند فصل:\n\n| پیرامیٹر | مناسب حد | اہمیت |\n|-----------|----------|--------|\n| pH | 6.0 - 7.5 | غذائیت دی دستیابی |\n| نائٹروجن | 250-500 کلو/ہیکٹر | پتیاں دی واداری |\n| فاسفورس | 20-25 کلو/ہیکٹر | جڑاں دی واداری |\n\n🏢 مقامی محکمہ زراعت مٹی دے سستے ٹیسٹ فراہم کردا اے۔"
  ],
  water: [
    "**سمارٹ پانی دین دا طریقہ** 💧\n\n| طریقہ | پانی بچت | کیہڑی فصل لئی |\n|--------|----------|--------|\n| ڈرپ | 60% تک | سبزیاں، پھل |\n| سپرنکلر | 30% تک | فیلڈ فصلاں |\n| نالی | معتدل | قطار فصلاں |\n\n💡 صبح سویرے یا شام نوں پانی دیو۔"
  ],
  disease: [
    "**فصل دی بیماری دی پہچان** 🔍\n\n| نشانی | ممکن سبب | عمل |\n|--------|----------|------|\n| پیلاپن | غذائیت دی کمی | مٹی ٹیسٹ |\n| بھورے دھبے | پھپھوندی | فنگی سائیڈ |\n| مرجھانا | بیکٹیریل ولٹ | متاثر بوٹے ہٹاؤ |\n\n📋 پتیاں دے نمونے مقامی محکمے ولّ موکلو۔"
  ],
  default: [
    "ایہ ودیا سوال اے! زراعت وچ، ہمیشہ اپنے مقامی زرعی ادارے توں صلاح لینا بہتر اے۔ میں عمومی رہنمائی دے سکدا آں۔ مہربانی کر کے اپنا سوال ہور تفصیل نال دسو۔",
  ]
};

// ─── Pashto responses ────────────────────────────────────────
export const pashtoResponses = {
  crop: [
    "**د دې موسم لپاره د کرنې مشورې:**\n\n| موسم | فصله | وخت |\n|------|------|------|\n| ربیع | غنم، جوار | اکتوبر - مارچ |\n| خریف | وري، جواري | جون - ستمبر |\n| اضافي | سبزيجاتې | ټول کال |\n\n🌾 د خپلې سیمې اوبوهوا او اوبو ته پام وکړئ.",
    "**د اعظمي کرنې لپاره** د فصولو بدلول مه هیروئ. د جنتیز اوبړو له لاسه ورکولو مخنیوي لپاره نور فصلونه هم مهال ویش کرئ."
  ],
  weather: [
    "**د هوا مشورې** 🌤️\n\n- تودوخې مناسب دی — غنمو ته ښې ده\n— د ورږي امکان شته\n— د ژمي ژمړتیا څخه د ملچکارۍ له لارې ژغورنه\n\n💡 هر ورځ د موسم اپلیکشنونه وگورئ.",
  ],
  fertilizer: [
    "**د غنمو لپاره د خوارو لیښتنه** 🧪\n\n| مرحله | خوړه | اندازه |\n|--------|--------|---------|\n| د تخم اچولو پر مهال | ڈی اے پی | ۵۰ ګ په جريب کې |\n| لومړني اوبلو وروسته | یوریا | ۵۰ ګ په جريب کې |\n\n⚠️ تل مخکې له کر کولو څخه د خاورې آزمایښه واخلئ.",
  ],
  pest: [
    "**د خوړو ژوندوارو مدیریت (IPM)** 🐛\n\n١.لومړی بیولوژیکي مخنیوی.\n٢. نیمو تیل چمچه په یو لترو کې ورګدي کړئ.\n٣ کیمیاوي سپیلار تل ورور وروستی حل ده.\n\n⏰ د سپیلار په سهار کې یا په ماښام کې وکړئ.",
  ],
  hello: [
    "**خیرې راغلاست! 🌾**\n\nستاسو ته د AI کشاورزی مرستیال کې ښې راغلاست. زه ستاسې سره دننه مرسته کولاى شم:\n\n- 🌿 د غوره فصل ټاکل\n— 🐛 د حشراتو کنټرول\n— 🧪 د خاورې او خواروالي\n– 💧 اوبړلونه\n– 📊 د بازار بیې\n\nنن څنگه ستاسې سره مرسته وشم?",
  ],
  thank: [
    "مننه! 🌾 د کشاورۍ ستاسې اړتیاوو کې د مرستې له امله خوښ یم. له نوو پوښتنو څخه مه ډاریږئ!",
  ],
  potato: [
    "**🥔 د کچالو پیږ (بلایټ)**\n\n**پېژندنه:**\n— د پاڼو په تېرو نښو\n– د پاڼو لاندې سپین فنجوس\n– په نمه هوا کې ژر ژر وچېدل\n\n**درملنه:** Mancozeb 75 WP، ورورستي Metalaxyl+Mancozeb\n⚠️ د حاصل اخیستو ۱۴ ورځې مخکې سپיל بند کړئ.",
  ],
  locust: [
    "**🦗 د تل د ګڼ ژوند څخه مخنیوي**\n\n**فوري کارونه:** محلي کرنیز ادارې ته راپور؛ سهار مهالکت؛ غږیز خنډونه.\n**کیمیاوي مخنیوی:** Malathion 96٪ ULV، Lambda-cyhalothrin.",
  ],
  soil: [
    "**د خاورې روغتیا** 🧪\n\n| معیار | مناسبه کچه | پوښته |\n|-----------|----------|--------|\n| pH | ۶.۵ – ۷٫۵ | غذائي توکي |\n| نایټروجن | ۲۵۰–۵۰۰ کیلو/HA | لاړ وده |\n\n🏢 ستاسې سیمې کرنیزه ادارې د خاورې ازموینې خدمتونه وړاندې کوي.",
  ],
  water: [
    "**ښه اوبړل** 💧\n\nد ډبي سپړنې له لارې اوبه خوندي کوئ؛ د سوبو او میوو لپاره ډیر ګټور دی؛ د سړې سهار یا ماښام کې وچ کړئ.",
  ],
  disease: [
    "**د نباتاتو ناروغیو پیژنه** 🔍\n\nنښې: ژېړ پاڼې؛ نسواري نښې؛ فنجوس یان باکتریا.\n\nنمونې مهرباني وکړئ خپل کرنیز مرکز ته وسپارئ.",
  ],
  default: [
    "ښې پوښتنه ده! ستاسې سیمې لپاره د کرنی متخصصانو ته مراجعه مه هیرېږئ. زه عمومې لارښوونې ورکولاى شم مهرباني وکړئ پوښتنه جزویات ته راوړئ.",
  ]
};

// Default/fallback responses when no keyword matches
export const defaultResponses = [
  "That's a great agricultural question! I'd recommend consulting your local agriculture extension office for region-specific advice.\n\n**Key principles for successful farming:**\n- 🌱 Healthy soil maintenance\n- 💧 Proper irrigation management\n- 🐛 Integrated pest management\n- 🌤️ Weather monitoring\n\nWould you like to explore any of these topics?",
  "Interesting query! Agriculture is a vast field. Could you be more specific?\n\n**I can help with:**\n1. Crops & cultivation\n2. Fertilizers & nutrients\n3. Pest & disease management\n4. Irrigation & water\n5. Soil health\n6. Weather & climate\n7. Market information\n\nJust ask about any of these!",
  "Great question! For the best results, I recommend a **holistic approach** to farming:\n\n- ✅ Regular soil testing\n- ✅ Appropriate crop varieties\n- ✅ Timely irrigation\n- ✅ Balanced fertilization\n- ✅ Regular pest monitoring\n\nWhat specific area would you like to explore?"
];

// Rotating placeholder texts for the input field
export const placeholderTexts = {
  en: [
    "Ask about wheat rust treatment...",
    "What fertilizer do I need for tomatoes?",
    "How to identify pest damage on rice...",
    "Best irrigation schedule for cotton...",
    "When should I harvest my sugarcane?",
    "How to improve soil fertility...",
    "What crops grow best in sandy soil?",
    "How to treat potato blight...",
  ],
  ur: [
    "گندم کی زنگ کے علاج کے بارے میں پوچھیں...",
    "ٹماٹروں کے لیے کون سی کھاد چاہیے؟",
    "چاول پر کیڑوں کی نشاندہی...",
    "کپاس کی بہترین آبپاشی...",
    "گنے کی کٹائی کب کروں؟",
    "مٹی کی زرخیزی کیسے بہتر بنائیں...",
  ],
  sd: [
    "کنک جي زنگ جو علاج پڇو...",
    "ٽماٽن لاءِ ڪهڙي کاد گهرجي؟",
    "چانور تي ڪيڙن جي نشاندهي...",
    "ڪپهه جي بهترين پاڻي ڏيڻ...",
    "اُک جي ڪٽائي ڪڏهن ڪجي؟",
    "مٽيءَ جي زرخيزي ڪيئن بهتر بڻايو...",
  ],
  pa: [
    "کنک دی زنگ دے علاج بارے پچھو...",
    "ٹماٹراں لئی کیہڑی کھاد چاہیدی اے؟",
    "چولاں تے کیڑیاں دی پہچان...",
    "کپاہ دی بہترین پانی دین...",
    "گنے دی کٹائی کدوں کرئیے؟",
    "مٹی دی زرخیزی کیویں بہتر بنائیے...",
  ],
  ps: [
    "د غنمی زنگ د درملو په اړه وپېښتئ…",
    "د بانجانو لپاره کومه خوړه پکار ده؟",
    "په وریجو کې د تاښي تاوان څنګه پیژني…",
    "د کپاس لپاره غوره اوبړل کله وکړو…",
    "د ګړو حاصل څنگه مهال واخلئ…",
    "د ځمکې خوږوالی څرنګه ښه کوو…",
  ]
};

// Quick reply chip configurations (above input field)
export const quickReplyChips = {
  en: [
    { icon: "🌤️", label: "Weather Forecast", query: "What's the weather forecast for farming this week?" },
    { icon: "🐛", label: "Pest ID", query: "How can I identify pests in my crops?" },
    { icon: "🧪", label: "Soil Health", query: "How should I test my soil health before planting?" },
    { icon: "💧", label: "Irrigation", query: "What are the best irrigation practices for my farm?" },
    { icon: "🌾", label: "Crop Guide", query: "What is the best crop to plant this season?" },
    { icon: "📊", label: "Market Prices", query: "What are the current market prices for crops?" },
  ],
  ur: [
    { icon: "🌤️", label: "موسم", query: "اس ہفتے کھیتی کے لیے موسم کی پیشن گوئی کیا ہے؟" },
    { icon: "🐛", label: "کیڑے", query: "فصلوں میں کیڑوں کی شناخت کیسے کروں؟" },
    { icon: "🧪", label: "مٹی", query: "بوائی سے پہلے مٹی کی جانچ کیسے کریں؟" },
    { icon: "💧", label: "آبپاشی", query: "بہترین آبپاشی کے طریقے کیا ہیں؟" },
    { icon: "🌾", label: "فصل", query: "اس موسم میں کون سی فصل لگائیں؟" },
    { icon: "📊", label: "قیمتیں", query: "فصلوں کی موجودہ مارکیٹ قیمتیں کیا ہیں؟" },
  ],
  sd: [
    { icon: "🌤️", label: "موسم", query: "هن هفتي ڪاشتڪاري لاءِ موسم جي اڳڪٿي ڇا آهي؟" },
    { icon: "🐛", label: "ڪيڙا", query: "فصلن ۾ ڪيڙن جي سڃاڻپ ڪيئن ڪجي؟" },
    { icon: "🧪", label: "مٽي", query: "ٻوائي کان اڳ مٽي جي جانچ ڪيئن ڪجي؟" },
    { icon: "💧", label: "پاڻي", query: "بهترين پاڻي ڏيڻ جا طريقا ڪهڙا آهن؟" },
    { icon: "🌾", label: "فصل", query: "هن موسم ۾ ڪهڙي فصل لڳايو؟" },
    { icon: "📊", label: "قيمت", query: "فصلن جون موجوده مارڪيٽ قيمتون ڪهڙيون آهن؟" },
  ],
  pa: [
    { icon: "🌤️", label: "موسم", query: "اس ہفتے کھیتی لئی موسم دی پیشنگوئی کیہ اے؟" },
    { icon: "🐛", label: "کیڑا", query: "فصلاں وچ کیڑیاں دی پہچان کیویں کرئیے؟" },
    { icon: "🧪", label: "مٹی", query: "بیجن توں پہلاں مٹی دی جانچ کیویں کرئیے؟" },
    { icon: "💧", label: "پانی", query: "بہترین پانی دین دے طریقے کیہ نے؟" },
    { icon: "🌾", label: "فصل", query: "اس موسم وچ کیہڑی فصل لائیے؟" },
    { icon: "📊", label: "قیمت", query: "فصلاں دیاں مارکیٹ قیمتاں کیہ نے؟" },
  ],
  ps: [
    { icon: "🌤️", label: "هوا", query: "دمې اونۍ کې د کرنې لپاره موسم څرنګه دی؟" },
    { icon: "🐛", label: "تاړی", query: "په فصلونو کې حشرې څرنګه پیژني؟" },
    { icon: "🧪", label: "خاوره", query: "مخکې له کر کولو څخه د خاورې ازموینه څرنګه واخلم؟" },
    { icon: "💧", label: "اوبه", query: "ښې اوبړل به کوم طریقو سره کېږي؟" },
    { icon: "🌾", label: "فصله", query: "په دې موسم کې څه فصل ښې دی؟" },
    { icon: "📊", label: "بيې", query: "دم مهال د فصولو بازار بيې څومره دي؟" },
  ]
};

// Suggestion button configurations
export const suggestions = [
  { text: "🌾 Best crop for this season", query: "What is the best crop to plant this season?" },
  { text: "🐛 How to treat plant disease?", query: "How can I treat plant diseases in my crops?" },
  { text: "💧 Irrigation tips", query: "What are the best irrigation practices for my farm?" },
  { text: "🧪 Soil testing guide", query: "How should I test my soil before planting?" },
  { text: "🌿 Organic farming methods", query: "Tell me about organic farming methods and practices" },
  { text: "📊 Market price updates", query: "What are the current market prices for crops?" }
];

// Urdu suggestion buttons
export const urduSuggestions = [
  { text: "🌾 اس موسم کی بہترین فصل", query: "اس موسم میں کون سی فصل لگانا بہتر ہے؟" },
  { text: "🐛 پودوں کی بیماری کا علاج", query: "فصلوں میں پودوں کی بیماریوں کا علاج کیسے کریں؟" },
  { text: "💧 آبپاشی کے مشورے", query: "کھیت کے لیے بہترین آبپاشی کے طریقے کیا ہیں؟" },
  { text: "🧪 مٹی کی جانچ", query: "بوائی سے پہلے مٹی کی جانچ کیسے کریں؟" },
  { text: "🌿 نامیاتی کاشتکاری", query: "نامیاتی کاشتکاری کے طریقوں کے بارے میں بتائیں" },
  { text: "📊 مارکیٹ قیمت", query: "فصلوں کی موجودہ مارکیٹ قیمتیں کیا ہیں؟" }
];

// Sindhi suggestion buttons
export const sindhiSuggestions = [
  { text: "🌾 هن موسم جي بهترين فصل", query: "هن موسم ۾ ڪهڙي فصل لڳائڻ بهتر آهي؟" },
  { text: "🐛 ٻوٽن جي بيماري جو علاج", query: "فصلن ۾ ٻوٽن جي بيمارين جو علاج ڪيئن ڪجي؟" },
  { text: "💧 پاڻي ڏيڻ جا مشورا", query: "کيت لاءِ بهترين پاڻي ڏيڻ جا طريقا ڪهڙا آهن؟" },
  { text: "🧪 مٽي جي جانچ", query: "ٻوائي کان اڳ مٽي جي جانچ ڪيئن ڪجي؟" },
  { text: "🌿 قدرتي کيتي", query: "قدرتي کيتي جي طريقن بابت ٻڌايو" },
  { text: "📊 مارڪيٽ قيمت", query: "فصلن جون موجوده مارڪيٽ قيمتون ڪهڙيون آهن؟" }
];

// Punjabi suggestion buttons
export const punjabiSuggestions = [
  { text: "🌾 اس موسم دی بہترین فصل", query: "اس موسم وچ کیہڑی فصل لانا بہتر اے؟" },
  { text: "🐛 بوٹیاں دی بیماری دا علاج", query: "فصلاں وچ بوٹیاں دی بیماریاں دا علاج کیویں کرئیے؟" },
  { text: "💧 پانی دین دے مشورے", query: "کھیت لئی بہترین پانی دین دے طریقے کیہ نے؟" },
  { text: "🧪 مٹی دی جانچ", query: "بیجن توں پہلاں مٹی دی جانچ کیویں کرئیے؟" },
  { text: "🌿 قدرتی کھیتی", query: "قدرتی کھیتی دے طریقیاں بارے دسو" },
  { text: "📊 مارکیٹ قیمت", query: "فصلاں دیاں موجودہ مارکیٹ قیمتاں کیہ نے؟" }
];

// Pashto suggestion buttons
export const pashtoSuggestions = [
  { text: "🌾 د دې موسم غوره فصله", query: "په دې موسم کې کومه فصل غوره ده؟" },
  { text: "🐛 د نباتاتو ناروغی درملنه", query: "په کرنیزو فصلونو کې د نبات ناروغیو درملنه څرنګه وکړم؟" },
  { text: "💧 د اوبړلو مشورې", query: "د خپل کرون ساحې لپاره ښې اوبړل کوم دي؟" },
  { text: "🧪 د خاورې ازموینه", query: "مخکې له تخم ایښودو څخه د ځمکې ازموینه څرنګه واخلم؟" },
  { text: "🌿 ارګانیک کرنه", query: "د ارګانیک کرنې طریقې راته ووایاست" },
  { text: "📊 د بازار بیې", query: "فصلونو اوسنی بازار بیې څومره دي؟" }
];

// Dummy chat history items
export const dummyChatHistory = [
  { id: 1, title: "Wheat crop diseases", date: "Today" },
  { id: 2, title: "Fertilizer schedule for rice", date: "Today" },
  { id: 3, title: "Best irrigation methods", date: "Yesterday" },
  { id: 4, title: "Soil pH adjustment tips", date: "Yesterday" },
  { id: 5, title: "Organic pest control", date: "Apr 8" },
  { id: 6, title: "Cotton planting season", date: "Apr 7" },
  { id: 7, title: "Market prices for wheat", date: "Apr 5" },
  { id: 8, title: "Seed treatment guide", date: "Apr 3" }
];

// ─── Response set per language ───────────────────────────────
const RESPONSE_MAP = {
  en: keywordResponses,
  ur: urduResponses,
  sd: sindhiResponses,
  pa: punjabiResponses,
  ps: pashtoResponses,
};

// ─── Keyword synonyms per language ───────────────────────────
// English synonyms for English keyword matching
const EN_SYNONYMS = {
  crop: ['plant', 'grow', 'cultivation', 'farming', 'vegetable', 'fruit', 'season', 'sow'],
  weather: ['rain', 'temperature', 'climate', 'forecast', 'monsoon', 'winter', 'summer'],
  fertilizer: ['nutrient', 'npk', 'urea', 'dap', 'manure', 'compost', 'nitrogen'],
  pest: ['insect', 'bug', 'worm', 'aphid', 'pesticide', 'spray', 'caterpillar'],
  locust: ['locust', 'tiddi'],
  potato: ['potato', 'blight', 'aloo'],
  disease: ['fungus', 'rust', 'wilt', 'rot', 'infection', 'yellow'],
  soil: ['land', 'earth', 'ph', 'clay', 'sandy', 'loam', 'organic matter'],
  water: ['irrigat', 'drip', 'flood', 'moisture', 'drought', 'canal', 'pump'],
  seed: ['variety', 'hybrid', 'germination', 'sowing', 'nursery'],
  harvest: ['yield', 'produce', 'output', 'storage', 'post-harvest'],
  market: ['price', 'sell', 'mandi', 'trade', 'profit', 'income'],
  hello: ['hi', 'hey', 'greet', 'assalam', 'welcome', 'good morning', 'good evening'],
  thank: ['thanks', 'appreciate', 'grateful', 'shukriya']
};

// Urdu synonyms
const UR_SYNONYMS = {
  crop: ['فصل', 'کاشت', 'بیج', 'سبزی', 'پھل', 'موسم', 'اگائیں', 'لگائیں', 'کھیتی', 'زراعت'],
  weather: ['بارش', 'موسم', 'درجہ حرارت', 'پیشن گوئی', 'سردی', 'گرمی', 'مانسون', 'آب و ہوا'],
  fertilizer: ['کھاد', 'یوریا', 'ڈی اے پی', 'کمپوسٹ', 'نائٹروجن', 'غذائیت'],
  pest: ['کیڑے', 'کیڑا', 'سپرے', 'حشرات', 'مکوڑے', 'تیلا', 'سنڈی'],
  locust: ['ٹڈی', 'ٹڈی دل'],
  potato: ['آلو', 'بلائیٹ'],
  disease: ['بیماری', 'زنگ', 'پھپھوندی', 'مرجھانا', 'انفیکشن', 'پیلا'],
  soil: ['مٹی', 'زمین', 'زرخیزی'],
  water: ['آبپاشی', 'پانی', 'نہر', 'ڈرپ', 'سیلاب', 'خشک سالی'],
  seed: ['بیج', 'قسم', 'ہائبرڈ', 'بوائی', 'نرسری'],
  harvest: ['فصل کاٹنا', 'پیداوار', 'ذخیرہ', 'کٹائی'],
  market: ['قیمت', 'بیچنا', 'منڈی', 'تجارت', 'منافع', 'آمدنی', 'مارکیٹ'],
  hello: ['السلام', 'سلام', 'ہیلو', 'خوش آمدید'],
  thank: ['شکریہ', 'مہربانی']
};

// Sindhi synonyms
const SD_SYNONYMS = {
  crop: ['فصل', 'ڪاشت', 'ٻج', 'سبزي', 'ميوو', 'موسم', 'لڳايو', 'کيتي', 'زراعت'],
  weather: ['برسات', 'موسم', 'درجه حرارت', 'سردي', 'گرمي', 'مانسون', 'آبهوا'],
  fertilizer: ['کاد', 'يوريا', 'ڊي اي پي', 'ڪمپوسٽ', 'نائٽروجن', 'غذائيت'],
  pest: ['ڪيڙا', 'ڪيڙن', 'سپري', 'حشرات', 'تيلو'],
  locust: ['ٽڊي', 'ٽڊي دل'],
  potato: ['آلو', 'بلائيٽ'],
  disease: ['بيماري', 'زنگ', 'ڦڦونداٺ', 'مرجھائڻ', 'انفيڪشن', 'پيلو'],
  soil: ['مٽي', 'زمين', 'زرخيزي'],
  water: ['پاڻي', 'نهر', 'ڊرپ', 'ٻوڏ', 'خشڪ سالي', 'آبپاشي'],
  seed: ['ٻج', 'قسم', 'هائبرڊ', 'ٻوائي', 'نرسري'],
  harvest: ['ڪٽائي', 'پيداوار', 'ذخيرو'],
  market: ['قيمت', 'وڪڻڻ', 'منڊي', 'تجارت', 'نفعو', 'آمدني', 'مارڪيٽ'],
  hello: ['السلام', 'سلام', 'هيلو', 'ڀلي ڪري'],
  thank: ['مهرباني', 'شڪريو']
};

// Punjabi synonyms
const PA_SYNONYMS = {
  crop: ['فصل', 'کاشت', 'بیج', 'سبزی', 'پھل', 'موسم', 'لاؤ', 'کھیتی', 'زراعت'],
  weather: ['بارش', 'موسم', 'درجہ حرارت', 'سردی', 'گرمی', 'مانسون', 'آبوہوا'],
  fertilizer: ['کھاد', 'یوریا', 'ڈی اے پی', 'کمپوسٹ', 'نائٹروجن', 'غذائیت'],
  pest: ['کیڑا', 'کیڑیاں', 'سپرے', 'حشرات'],
  locust: ['ٹڈی', 'ٹڈی دل'],
  potato: ['آلو', 'بلائیٹ'],
  disease: ['بیماری', 'زنگ', 'پھپھوندی', 'مرجھانا', 'انفیکشن', 'پیلا'],
  soil: ['مٹی', 'زمین', 'زرخیزی'],
  water: ['پانی', 'نہر', 'ڈرپ', 'ہڑ', 'خشک سالی', 'آبپاشی'],
  seed: ['بیج', 'قسم', 'ہائبرڈ', 'بیجن', 'نرسری'],
  harvest: ['کٹائی', 'پیداوار', 'ذخیرہ', 'وڈھنا'],
  market: ['قیمت', 'ویچنا', 'منڈی', 'تجارت', 'نفع', 'آمدنی', 'مارکیٹ'],
  hello: ['السلام', 'سلام', 'ہیلو', 'خوش آمدید', 'ست سری اکال'],
  thank: ['شکریہ', 'مہربانی']
};

const PS_SYNONYMS = {
  crop: ['فصله', 'کرنه', 'کرني', 'کرل', 'کرکیل', 'کرنیز', 'زراعت', 'سبزیجات'],
  weather: ['موسم', 'ورږى', 'باران', 'هوا', 'تودوخه'],
  fertilizer: ['خورا', 'خور', 'یوریا', 'دی ای پی', 'خوراک'],
  pest: ['تاړی', 'حشره', 'کیږی', 'کیڼی', 'حشرات'],
  locust: ['ټډی', 'تل', 'ګڼ ژوند'],
  potato: ['الو', 'پیازک', 'کچالی'],
  disease: ['ناروغي', 'ناروغۍ', 'پوښتې', 'پیښ'],
  soil: ['خاوره', 'ځمکه', 'کرکيله'],
  water: ['اوبه', 'اوبړل', 'اوبو ګټه', 'نش'],
  seed: ['تخم', 'ټوټي', 'کرل'],
  harvest: ['حاصل', 'کرټ', 'ټولون'],
  market: ['بازار', 'بيې', 'پلور', 'قرض'],
  hello: ['سلام', 'خیر', 'راغلاست', 'سترګې'],
  thank: ['مننه', 'نه مننه', 'مينه']
};

const SYNONYM_MAP = {
  en: EN_SYNONYMS,
  ur: UR_SYNONYMS,
  sd: SD_SYNONYMS,
  pa: PA_SYNONYMS,
  ps: PS_SYNONYMS,
};

/**
 * Generates a simulated AI response based on keyword matching.
 * Routes to the correct language response set (en/ur/sd/pa/ps) and
 * uses language-specific keyword synonyms for matching.
 */
export function getSimulatedResponse(message, language = 'en') {
  const lowerMessage = message.toLowerCase();
  const responses = RESPONSE_MAP[language] || keywordResponses;

  // 1. Check each keyword category for a direct match
  for (const [keyword, replies] of Object.entries(responses)) {
    if (keyword === 'default') continue; // skip default
    if (lowerMessage.includes(keyword)) {
      return replies[Math.floor(Math.random() * replies.length)];
    }
  }

  // 2. Check language-specific synonyms
  const synonyms = SYNONYM_MAP[language] || EN_SYNONYMS;
  for (const [category, words] of Object.entries(synonyms)) {
    for (const word of words) {
      if (lowerMessage.includes(word.toLowerCase())) {
        const categoryResponses = responses[category];
        if (categoryResponses) {
          return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
        }
      }
    }
  }

  // 3. If non-English, also try English synonyms as a last resort
  //    (user may type English keywords even in regional language mode)
  if (language !== 'en') {
    for (const [category, words] of Object.entries(EN_SYNONYMS)) {
      for (const word of words) {
        if (lowerMessage.includes(word)) {
          const categoryResponses = responses[category];
          if (categoryResponses) {
            return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
          }
        }
      }
    }
  }

  // 4. Fallback to default in the correct language
  if (responses.default) {
    const defaults = responses.default;
    return defaults[Math.floor(Math.random() * defaults.length)];
  }
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}
