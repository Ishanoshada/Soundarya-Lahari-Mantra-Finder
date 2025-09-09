import React, { useState } from 'react';

const TRANSLATIONS = {
  'English': {
      title: 'How to Use These Mantras & Slokas',
      hinduIntro: {
        title: 'For Hindu Mantras (Soundarya Lahari, Vedic, etc.)',
        text: [
            'The slokas and mantras presented here are powerful spiritual tools. Traditionally, the practice of such potent mantras, especially within the Shri Vidya tradition, is initiated by a qualified Guru (spiritual teacher) who provides personalized guidance and the necessary \'diksha\' (initiation).',
            '<strong>Important Disclaimer:</strong> Practicing these mantras without proper guidance or initiation can be ineffective or, in some beliefs, lead to unintended consequences. This application is an educational guide to help you understand the profound wisdom of these texts.',
            'If you are new to this path, it is highly recommended to seek a genuine Guru. If you choose to proceed, do so with the utmost humility, respect, and devotion. Focus on the divine form of the Goddess, try to understand the meaning, and chant with a pure heart. Your sincerity (bhava) is paramount.'
        ]
      },
      buddhistIntro: {
        title: 'For Buddhist Chanting (Pāli Canon)',
        text: [
            'Buddhist chanting is a practice of devotion, reflection, and setting intention. The chants, often from the Pāli Canon, are the words of the Buddha. They are recited to cultivate mindfulness, calm the mind, and develop qualities like loving-kindness (mettā) and compassion (karuṇā).',
            'While formal initiation is less common for general chants, understanding the meaning and context is vital. Reciting these words is a way to connect with the teachings and internalize them. It is best practiced in a calm, respectful state of mind. Unlike some Vedic mantras, the power here lies not just in the sonic vibration, but in the deep contemplation of the meaning and the wholesome qualities of mind that arise from the practice.'
        ]
      },
      rotation: {
        title: 'Rotation of Mantra (Advanced Practice)',
        text: 'For some advanced Hindu practices, a key principle is the rotation of the mantra through various energy centers (chakras). For this practice, the centers can correspond to the thumb and fingers of both hands. A specific bija (seed) mantra is chanted while concentrating on a particular center. This technique is similar to yoga nidra, but with the addition of mantra chanting. The goal is to circulate the energy of the mantras through these centers.',
        tableHeaders: {
            mantra: 'Mantra',
            chakra: 'Chakra',
            location: 'Physical Location'
        },
        table: [
            { mantra: 'Lam', chakra: 'Mooladhara', location: 'Perineum' },
            { mantra: 'Vam', chakra: 'Swadhisthana', location: 'Base of spine' },
            { mantra: 'Ram', chakra: 'Manipura', location: 'Navel center' },
            { mantra: 'Yam', chakra: 'Anahata', location: 'Heart centre' },
            { mantra: 'Ham', chakra: 'Vishuddhi', location: 'Throat pit' },
            { mantra: 'Om', chakra: 'Ajna', location: 'Eyebrow centre' }
        ]
    }
  },
  'Sinhala': {
      title: 'මෙම මන්ත්‍ර සහ ශ්ලෝක භාවිතා කරන්නේ කෙසේද?',
      hinduIntro: {
          title: 'හින්දු මන්ත්‍ර සඳහා (සෞන්දර්ය ලහරි, වෛදික, ආදිය)',
          text: [
              'මෙහි ඉදිරිපත් කර ඇති ශ්ලෝක සහ මන්ත්‍ර බලවත් අධ්‍යාත්මික මෙවලම් වේ. සාම්ප්‍රදායිකව, විශේෂයෙන්ම ශ්‍රී විද්‍යා සම්ප්‍රදාය තුළ, එවැනි ප්‍රබල මන්ත්‍ර භාවිතය ආරම්භ කරනු ලබන්නේ සුදුසුකම් ලත් ගුරුවරයෙකු විසින් වන අතර, ඔහු පුද්ගලික මග පෙන්වීම සහ අවශ්‍ය \'දීක්ෂාව\' ලබා දෙයි.',
              '<strong>වැදගත් සටහන:</strong> නිසි මග පෙන්වීමක් හෝ දීක්ෂාවක් නොමැතිව මෙම මන්ත්‍ර පුහුණු වීම අකාර්යක්ෂම විය හැකි අතර, සමහර විශ්වාසයන්ට අනුව, අනපේක්ෂිත ප්‍රතිවිපාකවලට තුඩු දිය හැකිය. මෙම යෙදුම මෙම ග්‍රන්ථවල ගැඹුරු ප්‍රඥාව අවබොධ කර ගැනීමට උපකාරී වන අධ්‍යාපනික මාර්ගෝපදේශයකි.',
              'ඔබ මෙම මාර්ගයට අලුත් නම්, සැබෑ ගුරුවරයෙකු සොයා ගැනීම බෙහෙවින් නිර්දේශ කෙරේ. ඔබ ඉදිරියට යාමට තෝරා ගන්නේ නම්, එය ඉතා නිහතමානීව, ගෞරවයෙන් සහ භක්තියෙන් යුතුව කරන්න. දේවියගේ දිව්‍යමය ස්වරූපය කෙරෙහි අවධානය යොමු කරන්න, අර්ථය තේරුම් ගැනීමට උත්සාහ කරන්න, සහ පිරිසිදු හදවතකින් ජප කරන්න. ඔබේ අවංකභාවය (භාව) ඉතා වැදගත් වේ.'
          ]
      },
      buddhistIntro: {
          title: 'බෞද්ධ පිරිත් සඳහා (පාලි ග්‍රන්ථ)',
          text: [
              'බෞද්ධ පිරිත් යනු භක්තිය, මෙනෙහි කිරීම සහ අභිප්‍රාය පිහිටුවීමේ පුහුණුවකි. බොහෝ විට පාලි ග්‍රන්ථ වලින් උපුටා ගත් මෙම ගාථා බුදුන් වහන්සේගේ වචන වේ. ඒවා සිහිය වර්ධනය කිරීමට, මනස සන්සුන් කිරීමට සහ මෛත්‍රිය (මෙත්තා) සහ කරුණාව (කරුණා) වැනි ගුණාංග වර්ධනය කිරීමට සජ්ඣායනය කෙරේ.',
              'සාමාන්‍ය පිරිත් සඳහා විධිමත් දීක්ෂාවක් අඩු වුවද, අර්ථය සහ සන්දර්භය අවබොධ කර ගැනීම ඉතා වැදගත් වේ. මෙම වචන සජ්ඣායනය කිරීම ඉගැන්වීම් සමඟ සම්බන්ධ වීමට සහ ඒවා අභ්‍යන්තරීකරණය කිරීමට මාර්ගයකි. එය සන්සුන්, ගෞරවනීය මනසකින් පුහුණු කිරීම වඩාත් සුදුසුය. සමහර වෛදික මන්ත්‍ර මෙන් නොව, මෙහි බලය රැඳී ඇත්තේ ශබ්ද කම්පනයේ පමණක් නොව, අර්ථය පිළිබඳ ගැඹුරු මෙනෙහි කිරීම සහ පුහුණුවෙන් පැන නගින කුසල් සිත් තුළය.'
          ]
      },
      rotation: {
        title: 'මන්ත්‍ර භ්‍රමණය (උසස් අභ්‍යාසය)',
        text: 'සමහර උසස් හින්දු අභ්‍යාස සඳහා, ප්‍රධාන මූලධර්මයක් වන්නේ විවිධ බල මධ්‍යස්ථාන (චක්‍ර) හරහා මන්ත්‍රය භ්‍රමණය කිරීමයි. මෙම අභ්‍යාසය සඳහා, මධ්‍යස්ථාන දෙඅත්වලම මාපටැඟිල්ල සහ ඇඟිලිවලට අනුරූප වේ. නිශ්චිත මධ්‍යස්ථානයක් කෙරෙහි අවධානය යොමු කරමින් නිශ්චිත බීජ මන්ත්‍රයක් ජප කරනු ලැබේ. මෙම ක්‍රමය යෝග නින්ද්‍රාවට සමාන වන නමුත් මන්ත්‍ර ජප කිරීමේ එකතු කිරීමක් ඇත. මෙහි අරමුණ වන්නේ මෙම මධ්‍යස්ථාන හරහා මන්ත්‍ර ශක්තිය සංසරණය කිරීමයි.',
        tableHeaders: {
            mantra: 'මන්ත්‍රය',
            chakra: 'චක්‍රය',
            location: 'භෞතික පිහිටීම'
        },
        table: [
            { mantra: 'Lam', chakra: 'Mooladhara', location: 'මූලාධාර ප්‍රදේශය' },
            { mantra: 'Vam', chakra: 'Swadhisthana', location: 'කොඳු ඇට පෙළේ පාදම' },
            { mantra: 'Ram', chakra: 'Manipura', location: 'නාභි මධ්‍යස්ථානය' },
            { mantra: 'Yam', chakra: 'Anahata', location: 'හෘද මධ්‍යස්ථානය' },
            { mantra: 'Ham', chakra: 'Vishuddhi', location: 'උගුරේ කුහරය' },
            { mantra: 'Om', chakra: 'Ajna', location: 'ඇහිබැම මධ්‍යස්ථානය' }
        ]
    }
  },
  'Tamil': {
      title: 'இந்த மந்திரங்களையும் ஸ்லோகங்களையும் பயன்படுத்துவது எப்படி',
      hinduIntro: {
        title: 'இந்து மந்திரங்களுக்கு (சௌந்தர்ய லஹரி, வேதம், முதலியன)',
        text: [
            'இங்கு வழங்கப்படும் ஸ்லோகங்களும் மந்திரங்களும் சக்திவாய்ந்த ஆன்மீக கருவிகள். பாரம்பரியமாக, ஸ்ரீ வித்யா பாரம்பரியத்தில் இத்தகைய சக்திவாய்ந்த மந்திரங்களின் பயிற்சி, ஒரு தகுதிவாய்ந்த குருவால் (ஆன்மீக ஆசிரியர்) தீட்சை அளிக்கப்பட்டு, தனிப்பட்ட வழிகாட்டுதலுடன் தொடங்கப்படுகிறது.',
            '<strong>முக்கிய குறிப்பு:</strong> சரியான வழிகாட்டுதல் அல்லது தீட்சை இல்லாமல் இந்த மந்திரங்களைப் பயிற்சி செய்வது பயனற்றதாக இருக்கலாம் அல்லது சில நம்பிக்கைகளின்படி, எதிர்பாராத விளைவுகளுக்கு வழிவகுக்கும். இந்த பயன்பாடு இந்த நூல்களின் ஆழ்ந்த ஞானத்தைப் புரிந்துகொள்ள உதவும் ஒரு கல்வி வழிகாட்டியாகும்.',
            'நீங்கள் இந்த பாதைக்கு புதியவராக இருந்தால், ஒரு உண்மையான குருவைத் தேடுவது மிகவும் பரிந்துரைக்கப்படுகிறது. நீங்கள் தொடர முடிவு செய்தால், மிகுந்த பணிவுடனும், மரியாதையுடனும், பக்தியுடனும் செய்யுங்கள். தேவியின் தெய்வீக வடிவத்தில் கவனம் செலுத்துங்கள், பொருளைப் புரிந்து கொள்ள முயற்சி செய்யுங்கள், தூய இதயத்துடன் ஜபிக்கவும். உங்கள் நேர்மை (பாவம்) மிக முக்கியமானது.'
        ]
      },
      buddhistIntro: {
        title: 'பௌத்த பாராயணத்திற்கு (பாலி நியதி)',
        text: [
            'பௌத்த பாராயணம் என்பது பக்தி, பிரதிபலிப்பு மற்றும் நோக்கத்தை அமைக்கும் ஒரு பயிற்சியாகும். பாலி நியதியிலிருந்து வரும் மந்திரங்கள் புத்தரின் வார்த்தைகள். அவை நினைவாற்றலை வளர்க்கவும், மனதை அமைதிப்படுத்தவும், அன்பு-கருணை (மெத்தா) மற்றும் இரக்கம் (கருணா) போன்ற குணங்களை வளர்க்கவும் ஓதப்படுகின்றன.',
            'பொதுவான மந்திரங்களுக்கு முறையான தீட்சை குறைவாக இருந்தாலும், பொருளையும் சூழலையும் புரிந்துகொள்வது மிக முக்கியம். இந்த வார்த்தைகளை ஓதுவது போதனைகளுடன் இணைவதற்கும் அவற்றை உள்வாங்குவதற்கும் ஒரு வழியாகும். அமைதியான, மரியாதையான மனநிலையில் இதை பயிற்சி செய்வது சிறந்தது. சில வேத மந்திரங்களைப் போலல்லாமல், இங்குள்ள சக்தி ஒலி அதிர்வில் மட்டுமல்ல, பொருளின் ஆழமான சிந்தனையிலும், பயிற்சியிலிருந்து எழும் மனதின் ஆரோக்கியமான குணங்களிலும் உள்ளது.'
        ]
      },
      rotation: {
        title: 'மந்திர சுழற்சி (மேம்பட்ட பயிற்சி)',
        text: 'சில மேம்பட்ட இந்து பயிற்சிகளுக்கு, ஒரு முக்கிய கொள்கை என்பது பல்வேறு ஆற்றல் மையங்கள் (சக்கரங்கள்) வழியாக மந்திரத்தை சுழற்றுவதாகும். இந்த பயிற்சிக்கு, மையங்கள் இரண்டு கைகளின் கட்டைவிரல் மற்றும் விரல்களுடன் ஒத்திருக்கின்றன. ஒரு குறிப்பிட்ட பீஜ (விதை) மந்திரம் ஒரு குறிப்பிட்ட மையத்தில் கவனம் செலுத்தி உச்சரிக்கப்படுகிறது. இந்த நுட்பம் யோக நித்ராவைப் போன்றது, ஆனால் மந்திர உச்சரிப்பு கூடுதலாக உள்ளது. இந்த மையங்கள் வழியாக மந்திரங்களின் ஆற்றலைச் சுற்றுவதே இதன் நோக்கம்.',
        tableHeaders: {
            mantra: 'மந்திரம்',
            chakra: 'சக்கரம்',
            location: 'உடல் இருப்பிடம்'
        },
        table: [
            { mantra: 'Lam', chakra: 'Mooladhara', location: 'மூலாதாரப் பகுதி' },
            { mantra: 'Vam', chakra: 'Swadhisthana', location: 'முதுகெலும்பின் அடித்தளம்' },
            { mantra: 'Ram', chakra: 'Manipura', location: 'தொப்புள் மையம்' },
            { mantra: 'Yam', chakra: 'Anahata', location: 'இதய மையம்' },
            { mantra: 'Ham', chakra: 'Vishuddhi', location: 'தொண்டைக்குழி' },
            { mantra: 'Om', chakra: 'Ajna', location: 'புருவ மையம்' }
        ]
    }
  },
  'Hindi': {
      title: 'इन मंत्रों और श्लोकों का उपयोग कैसे करें',
      hinduIntro: {
        title: 'हिंदू मंत्रों के लिए (सौंदर्य लहरी, वैदिक, आदि)',
        text: [
            'यहाँ प्रस्तुत श्लोक और मंत्र शक्तिशाली आध्यात्मिक उपकरण हैं। परंपरागत रूप से, ऐसे शक्तिशाली मंत्रों का अभ्यास, विशेष रूप से श्री विद्या परंपरा में, एक योग्य गुरु द्वारा शुरू किया जाता है जो व्यक्तिगत मार्गदर्शन और आवश्यक \'दीक्षा\' प्रदान करते हैं।',
            '<strong>महत्वपूर्ण अस्वीकरण:</strong> उचित मार्गदर्शन या दीक्षा के बिना इन मंत्रों का अभ्यास अप्रभावी हो सकता है या, कुछ मान्यताओं के अनुसार, अनपेक्षित परिणाम दे सकता है। यह एप्लिकेशन इन ग्रंथों के गहन ज्ञान को समझने में आपकी मदद करने के लिए एक शैक्षिक मार्गदर्शिका है।',
            'यदि आप इस मार्ग पर नए हैं, तो एक वास्तविक गुरु की तलाश करने की अत्यधिक अनुशंसा की जाती है। यदि आप आगे बढ़ने का विकल्प चुनते हैं, तो अत्यंत विनम्रता, सम्मान और भक्ति के साथ ऐसा करें। देवी के दिव्य रूप पर ध्यान केंद्रित करें, अर्थ को समझने की कोशिश करें, और शुद्ध हृदय से जाप करें। आपकी ईमानदारी (भाव) सर्वोपरि है।'
        ]
      },
      buddhistIntro: {
        title: 'बौद्ध जाप के लिए (पालि कैनन)',
        text: [
            'बौद्ध जाप भक्ति, चिंतन और इरादा स्थापित करने का एक अभ्यास है। पालि कैनन से प्राप्त मंत्र बुद्ध के शब्द हैं। वे सचेतनता विकसित करने, मन को शांत करने और प्रेम-कृपा (मेत्ता) और करुणा जैसे गुणों को विकसित करने के लिए पढ़े जाते हैं।',
            'यद्यपि सामान्य मंत्रों के लिए औपचारिक दीक्षा कम आम है, अर्थ और संदर्भ को समझना महत्वपूर्ण है। इन शब्दों का पाठ करना शिक्षाओं से जुड़ने और उन्हें आत्मसात करने का एक तरीका है। इसे शांत, सम्मानजनक मनःस्थिति में अभ्यास करना सबसे अच्छा है। कुछ वैदिक मंत्रों के विपरीत, यहाँ शक्ति केवल ध्वनि कंपन में नहीं, बल्कि अर्थ के गहरे चिंतन और अभ्यास से उत्पन्न होने वाले मन के स्वस्थ गुणों में निहित है।'
        ]
      },
      rotation: {
        title: 'मंत्र का घूर्णन (उन्नत अभ्यास)',
        text: 'कुछ उन्नत हिंदू प्रथाओं के लिए, एक प्रमुख सिद्धांत विभिन्न ऊर्जा केंद्रों (चक्रों) के माध्यम से मंत्र का घूर्णन है। इस अभ्यास के लिए, केंद्र दोनों हाथों के अंगूठे और उंगलियों के अनुरूप हो सकते हैं। एक विशेष बीज मंत्र का जाप एक विशेष केंद्र पर ध्यान केंद्रित करते हुए किया जाता है। यह तकनीक योग निद्रा के समान है, लेकिन इसमें मंत्र जाप का समावेश है। इसका लक्ष्य इन केंद्रों के माध्यम से मंत्रों की ऊर्जा को प्रसारित करना है।',
        tableHeaders: {
            mantra: 'मंत्र',
            chakra: 'चक्र',
            location: 'भौतिक स्थान'
        },
        table: [
            { mantra: 'Lam', chakra: 'Mooladhara', location: 'मूलाधार क्षेत्र' },
            { mantra: 'Vam', chakra: 'Swadhisthana', location: 'रीढ़ का आधार' },
            { mantra: 'Ram', chakra: 'Manipura', location: 'नाभि केंद्र' },
            { mantra: 'Yam', chakra: 'Anahata', location: 'हृदय केंद्र' },
            { mantra: 'Ham', chakra: 'Vishuddhi', location: 'गले का गड्ढा' },
            { mantra: 'Om', chakra: 'Ajna', location: 'भौंह केंद्र' }
        ]
    }
  },
  'Malayalam': {
      title: 'ഈ മന്ത്രങ്ങളും ശ്ലോകങ്ങളും എങ്ങനെ ഉപയോഗിക്കാം',
      hinduIntro: {
        title: 'ഹിന്ദു മന്ത്രങ്ങൾക്ക് (സൗന്ദര്യ ലഹരി, വൈദികം, മുതലായവ)',
        text: [
            'ഇവിടെ നൽകിയിട്ടുള്ള ശ്ലോകങ്ങളും മന്ത്രങ്ങളും ശക്തമായ ആത്മീയ ഉപകരണങ്ങളാണ്. പരമ്പരാഗതമായി, ശ്രീവിദ്യ പാരമ്പര്യത്തിൽ, അത്തരം ശക്തമായ മന്ത്രങ്ങളുടെ പരിശീലനം ഒരു യോഗ്യനായ ഗുരുവിൽ നിന്നാണ് ആരംഭിക്കുന്നത്. അദ്ദേഹം വ്യക്തിപരമായ മാർഗ്ഗനിർദ്ദേശവും ആവശ്യമായ \'ദീക്ഷ\'യും നൽകുന്നു.',
            '<strong>പ്രധാന നിരാകരണം:</strong> ശരിയായ മാർഗ്ഗനിർദ്ദേശമോ ദീക്ഷയോ ഇല്ലാതെ ഈ മന്ത്രങ്ങൾ പരിശീലിക്കുന്നത് ഫലപ്രദമല്ലാതാകാം, അല്ലെങ്കിൽ ചില വിശ്വാസങ്ങൾ അനുസരിച്ച്, അപ്രതീക്ഷിതമായ പ്രത്യാഘാതങ്ങളിലേക്ക് നയിച്ചേക്കാം. ഈ ഗ്രന്ഥങ്ങളുടെ അഗാധമായ ജ്ഞാനം മനസ്സിലാക്കാൻ സഹായിക്കുന്ന ഒരു വിദ്യാഭ്യാസപരമായ വഴികാട്ടിയാണ് ഈ ആപ്ലിക്കേഷൻ.',
            'നിങ്ങൾ ഈ പാതയിൽ പുതിയ ആളാണെങ്കിൽ, ഒരു യഥാർത്ഥ ഗുരുവിനെ തേടുന്നത് വളരെ ഉത്തമമാണ്. നിങ്ങൾ മുന്നോട്ട് പോകാൻ തീരുമാനിക്കുകയാണെങ്കിൽ, അങ്ങേയറ്റം വിനയത്തോടെയും ബഹുമാനത്തോടെയും ഭക്തിയോടെയും ചെയ്യുക. ദേവിയുടെ ദിവ്യരൂപത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക, അർത്ഥം മനസ്സിലാക്കാൻ ശ്രമിക്കുക, ശുദ്ധമായ ഹൃദയത്തോടെ ജപിക്കുക. നിങ്ങളുടെ ആത്മാർത്ഥത (ഭാവം) പരമപ്രധാനമാണ്.'
        ]
      },
      buddhistIntro: {
        title: 'ബുദ്ധമത ജപത്തിന് (പാലി കാനോൻ)',
        text: [
            'ബുദ്ധമത ജപം ഭക്തി, പ്രതിഫലനം, ഉദ്ദേശ്യം സ്ഥാപിക്കൽ എന്നിവയുടെ ഒരു പരിശീലനമാണ്. പാലി കാനോനിൽ നിന്നുള്ള മന്ത്രങ്ങൾ ബുദ്ധന്റെ വാക്കുകളാണ്. അവ ബോധപൂർവ്വം ജീവിക്കാനും, മനസ്സിനെ ശാന്തമാക്കാനും, സ്നേഹ-ദയ (മെത്ത), കരുണ തുടങ്ങിയ ഗുണങ്ങൾ വികസിപ്പിക്കാനും ചൊല്ലുന്നു.',
            'പൊതുവായ മന്ത്രങ്ങൾക്ക് ഔപചാരികമായ ദീക്ഷ കുറവാണെങ്കിലും, അർത്ഥവും സന്ദർഭവും മനസ്സിലാക്കുന്നത് വളരെ പ്രധാനമാണ്. ഈ വാക്കുകൾ ചൊല്ലുന്നത് പഠിപ്പിക്കലുകളുമായി ബന്ധപ്പെടാനും അവയെ ആന്തരികവൽക്കരിക്കാനും ഒരു മാർഗമാണ്. ശാന്തവും ആദരവുമുള്ള മനസ്സോടെ ഇത് പരിശീലിക്കുന്നതാണ് നല്ലത്. ചില വൈദിക മന്ത്രങ്ങളിൽ നിന്ന് വ്യത്യസ്തമായി, ഇവിടുത്തെ ശക്തി ശബ്ദത്തിന്റെ കമ്പനത്തിൽ മാത്രമല്ല, അർത്ഥത്തിന്റെ ആഴത്തിലുള്ള ധ്യാനത്തിലും, പരിശീലനത്തിൽ നിന്ന് ഉണ്ടാകുന്ന മനസ്സിന്റെ ആരോഗ്യകരമായ ഗുണങ്ങളിലുമാണ്.'
        ]
      },
      rotation: {
        title: 'മന്ത്ര ഭ്രമണം (വിപുലമായ പരിശീലനം)',
        text: 'ചില വിപുലമായ ഹിന്ദു ആചാരങ്ങൾക്ക്, ഒരു പ്രധാന തത്വം വിവിധ ഊർജ്ജ കേന്ദ്രങ്ങളിലൂടെ (ചക്രങ്ങൾ) മന്ത്രം ഭ്രമണം ചെയ്യുക എന്നതാണ്. ഈ പരിശീലനത്തിന്, കേന്ദ്രങ്ങൾ രണ്ട് കൈകളിലെയും പെരുവിരലിനും വിരലുകൾക്കും അനുയോജ്യമാകും. ഒരു പ്രത്യേക ബീജ (വിത്ത്) മന്ത്രം ഒരു പ്രത്യേക കേന്ദ്രത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിച്ച് ജപിക്കുന്നു. ഈ വിദ്യ യോഗനിദ്രയ്ക്ക് സമാനമാണ്, പക്ഷേ മന്ത്രജപം കൂടി ഇതിൽ ഉൾപ്പെടുന്നു. ഈ കേന്ദ്രങ്ങളിലൂടെ മന്ത്രങ്ങളുടെ ഊർജ്ജം പ്രചരിപ്പിക്കുക എന്നതാണ് ഇതിന്റെ ലക്ഷ്യം.',
        tableHeaders: {
            mantra: 'മന്ത്രം',
            chakra: 'ചക്രം',
            location: 'ഭൗതിക സ്ഥാനം'
        },
        table: [
            { mantra: 'Lam', chakra: 'Mooladhara', location: 'മൂലാധാര പ്രദേശം' },
            { mantra: 'Vam', chakra: 'Swadhisthana', location: 'നട്ടെല്ലിന്റെ അടിസ്ഥാനം' },
            { mantra: 'Ram', chakra: 'Manipura', location: 'നാഭി കേന്ദ്രം' },
            { mantra: 'Yam', chakra: 'Anahata', location: 'ഹൃദയ കേന്ദ്രം' },
            { mantra: 'Ham', chakra: 'Vishuddhi', location: 'തൊണ്ടക്കുഴി' },
            { mantra: 'Om', chakra: 'Ajna', location: 'പുരിക കേന്ദ്രം' }
        ]
    }
  }
};

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface HowToUseModalProps {
    onClose: () => void;
    initialLanguage: string;
}

const HowToUseModal: React.FC<HowToUseModalProps> = ({ onClose, initialLanguage }) => {
    const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage in TRANSLATIONS ? initialLanguage : 'English');
    const currentContent = TRANSLATIONS[selectedLanguage as keyof typeof TRANSLATIONS];

    return (
        <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="how-to-use-title"
        >
          <div 
            className="bg-gradient-to-br from-amber-50 to-rose-100 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col p-6 border border-amber-300/50"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-between items-center pb-4 border-b border-amber-200">
                <h2 id="how-to-use-title" className="text-2xl font-bold text-amber-900 font-playfair">{currentContent.title}</h2>
                <button 
                    onClick={onClose} 
                    className="text-amber-700 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-red-100"
                    aria-label="Close"
                >
                   <CloseIcon />
                </button>
            </header>

            <div className="mt-4 flex flex-wrap justify-center gap-2 mb-4">
                {Object.keys(TRANSLATIONS).map(lang => (
                    <button
                        key={lang}
                        onClick={() => setSelectedLanguage(lang)}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 ${
                            selectedLanguage === lang
                                ? 'bg-amber-800 text-white shadow-md'
                                : 'bg-white/80 text-amber-800 hover:bg-amber-100'
                        }`}
                        aria-pressed={selectedLanguage === lang}
                    >
                        {lang}
                    </button>
                ))}
            </div>
    
            <div className="mt-4 flex-grow overflow-y-auto pr-2 space-y-6">
                <div className="p-4 bg-amber-100/40 rounded-lg">
                    <h4 className="text-lg font-bold text-amber-900 mb-2">{currentContent.hinduIntro.title}</h4>
                    <div className="text-left leading-relaxed text-slate-700 space-y-3">
                        {currentContent.hinduIntro.text.map((paragraph, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                    </div>
                </div>

                <div className="p-4 bg-amber-100/40 rounded-lg">
                    <h4 className="text-lg font-bold text-amber-900 mb-2">{currentContent.buddhistIntro.title}</h4>
                    <div className="text-left leading-relaxed text-slate-700 space-y-3">
                        {currentContent.buddhistIntro.text.map((paragraph, index) => (
                            <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                        ))}
                    </div>
                </div>

                {currentContent.rotation && (
                    <div className="mt-6">
                        <h4 className="text-lg font-bold text-amber-900 mb-2">{currentContent.rotation.title}</h4>
                        <p className="text-left leading-relaxed text-slate-700 mb-4">{currentContent.rotation.text}</p>
                        <div className="overflow-x-auto rounded-lg border border-amber-200/50 shadow-md">
                            <table className="w-full text-left border-collapse bg-white/40">
                                <thead className="bg-amber-100/80 backdrop-blur-sm">
                                    <tr>
                                        <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{currentContent.rotation.tableHeaders.mantra}</th>
                                        <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{currentContent.rotation.tableHeaders.chakra}</th>
                                        <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{currentContent.rotation.tableHeaders.location}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentContent.rotation.table.map((item, index) => (
                                        <tr key={index} className="hover:bg-amber-50/50 transition-colors">
                                            <td className="p-3 border-b border-amber-100 font-semibold text-amber-900">{item.mantra}</td>
                                            <td className="p-3 border-b border-amber-100 text-slate-700 align-top">{item.chakra}</td>
                                            <td className="p-3 border-b border-amber-100 text-slate-700 align-top">{item.location}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
    );
};

export default HowToUseModal;