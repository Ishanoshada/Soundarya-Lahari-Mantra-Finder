import React from 'react';

const TRANSLATIONS = {
  'English': {
      title: 'How to Use These Mantras & Slokas',
      text: [
          'The slokas and mantras presented here are powerful spiritual tools. Traditionally, the practice of such potent mantras, especially within the Shri Vidya tradition, is initiated by a qualified Guru (spiritual teacher) who provides personalized guidance and the necessary \'diksha\' (initiation).',
          '<strong>Important Disclaimer:</strong> Practicing these mantras without proper guidance or initiation can be ineffective or, in some beliefs, lead to unintended consequences. This application is an educational guide to help you understand the profound wisdom of these texts.',
          'If you are new to this path, it is highly recommended to seek a genuine Guru. If you choose to proceed, do so with the utmost humility, respect, and devotion. Focus on the divine form of the Goddess, try to understand the meaning, and chant with a pure heart. Your sincerity (bhava) is paramount.'
      ],
      rotation: {
        title: 'Rotation of Mantra',
        text: 'Once you have understood these principles, a fourth point is the rotation of the mantra through various centers. For this practice, the centers correspond to the thumb, second, third, fourth, and fifth fingers of both hands. A specific mantra is chanted while concentrating on a particular center. This technique is similar to yoga nidra, but with the addition of mantra chanting. The goal is to circulate the mantras through these centers.',
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
      text: [
          'මෙහි ඉදිරිපත් කර ඇති ශ්ලෝක සහ මන්ත්‍ර බලවත් අධ්‍යාත්මික මෙවලම් වේ. සාම්ප්‍රදායිකව, විශේෂයෙන්ම ශ්‍රී විද්‍යා සම්ප්‍රදාය තුළ, එවැනි ප්‍රබල මන්ත්‍ර භාවිතය ආරම්භ කරනු ලබන්නේ සුදුසුකම් ලත් ගුරුවරයෙකු විසින් වන අතර, ඔහු පුද්ගලික මග පෙන්වීම සහ අවශ්‍ය \'දීක්ෂාව\' ලබා දෙයි.',
          '<strong>වැදගත් සටහන:</strong> නිසි මග පෙන්වීමක් හෝ දීක්ෂාවක් නොමැතිව මෙම මන්ත්‍ර පුහුණු වීම අකාර්යක්ෂම විය හැකි අතර, සමහර විශ්වාසයන්ට අනුව, අනපේක්ෂිත ප්‍රතිවිපාකවලට තුඩු දිය හැකිය. මෙම යෙදුම මෙම ග්‍රන්ථවල ගැඹුරු ප්‍රඥාව අවබෝධ කර ගැනීමට උපකාරී වන අධ්‍යාපනික මාර්ගෝපදේශයකි.',
          'ඔබ මෙම මාර්ගයට අලුත් නම්, සැබෑ ගුරුවරයෙකු සොයා ගැනීම බෙහෙවින් නිර්දේශ කෙරේ. ඔබ ඉදිරියට යාමට තෝරා ගන්නේ නම්, එය ඉතා නිහතමානීව, ගෞරවයෙන් සහ භක්තියෙන් යුතුව කරන්න. දේවියගේ දිව්‍යමය ස්වරූපය කෙරෙහි අවධානය යොමු කරන්න, අර්ථය තේරුම් ගැනීමට උත්සාහ කරන්න, සහ පිරිසිදු හදවතකින් ජප කරන්න. ඔබේ අවංකභාවය (භාව) ඉතා වැදගත් වේ.'
      ],
      rotation: {
        title: 'මන්ත්‍ර භ්‍රමණය',
        text: 'ඔබ මෙම මූලධර්ම අවබෝධ කරගත් පසු, හතරවන කරුණ වන්නේ විවිධ මධ්‍යස්ථාන හරහා මන්ත්‍රය භ්‍රමණය කිරීමයි. මෙම අභ්‍යාසය සඳහා, මධ්‍යස්ථාන දෙඅත්වලම මාපටැඟිල්ල, දෙවන, තෙවන, හතරවන සහ පස්වන ඇඟිලිවලට අනුරූප වේ. නිශ්චිත මධ්‍යස්ථානයක් කෙරෙහි අවධානය යොමු කරමින් නිශ්චිත මන්ත්‍රයක් ජප කරනු ලැබේ. මෙම ක්‍රමය යෝග නින්ද්‍රාවට සමාන වන නමුත් මන්ත්‍ර ජප කිරීමේ එකතු කිරීමක් ඇත. මෙහි අරමුණ වන්නේ මෙම මධ්‍යස්ථාන හරහා මන්ත්‍ර සංසරණය කිරීමයි.',
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
        text: [
            'இங்கு வழங்கப்படும் ஸ்லோகங்களும் மந்திரங்களும் சக்திவாய்ந்த ஆன்மீக கருவிகள். பாரம்பரியமாக, ஸ்ரீ வித்யா பாரம்பரியத்தில் இத்தகைய சக்திவாய்ந்த மந்திரங்களின் பயிற்சி, ஒரு தகுதிவாய்ந்த குருவால் (ஆன்மீக ஆசிரியர்) தீட்சை அளிக்கப்பட்டு, தனிப்பட்ட வழிகாட்டுதலுடன் தொடங்கப்படுகிறது.',
            '<strong>முக்கிய குறிப்பு:</strong> சரியான வழிகாட்டுதல் அல்லது தீட்சை இல்லாமல் இந்த மந்திரங்களைப் பயிற்சி செய்வது பயனற்றதாக இருக்கலாம் அல்லது சில நம்பிக்கைகளின்படி, எதிர்பாராத விளைவுகளுக்கு வழிவகுக்கும். இந்த பயன்பாடு இந்த நூல்களின் ஆழ்ந்த ஞானத்தைப் புரிந்துகொள்ள உதவும் ஒரு கல்வி வழிகாட்டியாகும்.',
            'நீங்கள் இந்த பாதைக்கு புதியவராக இருந்தால், ஒரு உண்மையான குருவைத் தேடுவது மிகவும் பரிந்துரைக்கப்படுகிறது. நீங்கள் தொடர முடிவு செய்தால், மிகுந்த பணிவுடனும், மரியாதையுடனும், பக்தியுடனும் செய்யுங்கள். தேவியின் தெய்வீக வடிவத்தில் கவனம் செலுத்துங்கள், பொருளைப் புரிந்து கொள்ள முயற்சி செய்யுங்கள், தூய இதயத்துடன் ஜபிக்கவும். உங்கள் நேர்மை (பாவம்) மிக முக்கியமானது.'
        ],
        rotation: {
            title: 'மந்திர சுழற்சி',
            text: 'இந்த கொள்கைகளை நீங்கள் புரிந்து கொண்டவுடன், நான்காவது புள்ளி பல்வேறு மையங்கள் வழியாக மந்திரத்தை சுழற்றுவதாகும். இந்த பயிற்சிக்கு, மையங்கள் இரண்டு கைகளின் கட்டைவிரல், இரண்டாவது, மூன்றாவது, நான்காவது மற்றும் ஐந்தாவது விரல்களுடன் ஒத்திருக்கின்றன. ஒரு குறிப்பிட்ட மையத்தில் கவனம் செலுத்தி ஒரு குறிப்பிட்ட மந்திரம் உச்சரிக்கப்படுகிறது. இந்த நுட்பம் யோக நித்ராவைப் போன்றது, ஆனால் மந்திர உச்சரிப்பு கூடுதலாக உள்ளது. இந்த மையங்கள் வழியாக மந்திரங்களைச் சுற்றுவதே இதன் நோக்கம்.',
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
        text: [
            'यहाँ प्रस्तुत श्लोक और मंत्र शक्तिशाली आध्यात्मिक उपकरण हैं। परंपरागत रूप से, ऐसे शक्तिशाली मंत्रों का अभ्यास, विशेष रूप से श्री विद्या परंपरा में, एक योग्य गुरु द्वारा शुरू किया जाता है जो व्यक्तिगत मार्गदर्शन और आवश्यक \'दीक्षा\' प्रदान करते हैं।',
            '<strong>महत्वपूर्ण अस्वीकरण:</strong> उचित मार्गदर्शन या दीक्षा के बिना इन मंत्रों का अभ्यास अप्रभावी हो सकता है या, कुछ मान्यताओं के अनुसार, अनपेक्षित परिणाम दे सकता है। यह एप्लिकेशन इन ग्रंथों के गहन ज्ञान को समझने में आपकी मदद करने के लिए एक शैक्षिक मार्गदर्शिका है।',
            'यदि आप इस मार्ग पर नए हैं, तो एक वास्तविक गुरु की तलाश करने की अत्यधिक अनुशंसा की जाती है। यदि आप आगे बढ़ने का विकल्प चुनते हैं, तो अत्यंत विनम्रता, सम्मान और भक्ति के साथ ऐसा करें। देवी के दिव्य रूप पर ध्यान केंद्रित करें, अर्थ को समझने की कोशिश करें, और शुद्ध हृदय से जाप करें। आपकी ईमानदारी (भाव) सर्वोपरि है।'
        ],
        rotation: {
            title: 'मंत्र का घूर्णन',
            text: 'जब आप इन सिद्धांतों को समझ जाते हैं, तो चौथा बिंदु विभिन्न केंद्रों के माध्यम से मंत्र का घूर्णन है। इस अभ्यास के लिए, केंद्र दोनों हाथों के अंगूठे, दूसरी, तीसरी, चौथी और पाँचवीं उंगलियों के अनुरूप होते हैं। एक विशेष केंद्र पर ध्यान केंद्रित करते हुए एक निश्चित मंत्र का जाप किया जाता है। यह तकनीक योग निद्रा के समान है, लेकिन इसमें मंत्र जाप का समावेश है। इसका लक्ष्य इन केंद्रों के माध्यम से मंत्रों को प्रसारित करना है।',
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
        text: [
            'ഇവിടെ നൽകിയിട്ടുള്ള ശ്ലോകങ്ങളും മന്ത്രങ്ങളും ശക്തമായ ആത്മീയ ഉപകരണങ്ങളാണ്. പരമ്പരാഗതമായി, ശ്രീവിദ്യ പാരമ്പര്യത്തിൽ, അത്തരം ശക്തമായ മന്ത്രങ്ങളുടെ പരിശീലനം ഒരു യോഗ്യനായ ഗുരുവിൽ നിന്നാണ് ആരംഭിക്കുന്നത്. അദ്ദേഹം വ്യക്തിപരമായ മാർഗ്ഗനിർദ്ദേശവും ആവശ്യമായ \'ദീക്ഷ\'യും നൽകുന്നു.',
            '<strong>പ്രധാന നിരാകരണം:</strong> ശരിയായ മാർഗ്ഗനിർദ്ദേശമോ ദീക്ഷയോ ഇല്ലാതെ ഈ മന്ത്രങ്ങൾ പരിശീലിക്കുന്നത് ഫലപ്രദമല്ലാതാകാം, അല്ലെങ്കിൽ ചില വിശ്വാസങ്ങൾ അനുസരിച്ച്, അപ്രതീക്ഷിതമായ പ്രത്യാഘാതങ്ങളിലേക്ക് നയിച്ചേക്കാം. ഈ ഗ്രന്ഥങ്ങളുടെ അഗാധമായ ജ്ഞാനം മനസ്സിലാക്കാൻ സഹായിക്കുന്ന ഒരു വിദ്യാഭ്യാസപരമായ വഴികാട്ടിയാണ് ഈ ആപ്ലിക്കേഷൻ.',
            'നിങ്ങൾ ഈ പാതയിൽ പുതിയ ആളാണെങ്കിൽ, ഒരു യഥാർത്ഥ ഗുരുവിനെ തേടുന്നത് വളരെ ഉത്തമമാണ്. നിങ്ങൾ മുന്നോട്ട് പോകാൻ തീരുമാനിക്കുകയാണെങ്കിൽ, അങ്ങേയറ്റം വിനയത്തോടെയും ബഹുമാനത്തോടെയും ഭക്തിയോടെയും ചെയ്യുക. ദേവിയുടെ ദിവ്യരൂപത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിക്കുക, അർത്ഥം മനസ്സിലാക്കാൻ ശ്രമിക്കുക, ശുദ്ധമായ ഹൃദയത്തോടെ ജപിക്കുക. നിങ്ങളുടെ ആത്മാർത്ഥത (ഭാവം) പരമപ്രധാനമാണ്.'
        ],
        rotation: {
            title: 'മന്ത്ര ഭ്രമണം',
            text: 'ഈ തത്വങ്ങൾ മനസ്സിലാക്കിക്കഴിഞ്ഞാൽ, നാലാമത്തെ കാര്യം വിവിധ കേന്ദ്രങ്ങളിലൂടെ മന്ത്രം ഭ്രമണം ചെയ്യുക എന്നതാണ്. ഈ പരിശീലനത്തിന്, കേന്ദ്രങ്ങൾ രണ്ട് കൈകളിലെയും പെരുവിരൽ, രണ്ടാമത്തെ, മൂന്നാമത്തെ, നാലാമത്തെ, അഞ്ചാമത്തെ വിരലുകൾക്ക് അനുയോജ്യമാണ്. ഒരു പ്രത്യേക കേന്ദ്രത്തിൽ ശ്രദ്ധ കേന്ദ്രീകരിച്ച് ഒരു പ്രത്യേക മന്ത്രം ജപിക്കുന്നു. ഈ വിദ്യ യോഗനിദ്രയ്ക്ക് സമാനമാണ്, പക്ഷേ മന്ത്രജപം കൂടി ഇതിൽ ഉൾപ്പെടുന്നു. ഈ കേന്ദ്രങ്ങളിലൂടെ മന്ത്രങ്ങൾ പ്രചരിപ്പിക്കുക എന്നതാണ് ഇതിന്റെ ലക്ഷ്യം.',
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

interface HowToUseGuideProps {
    language: string;
}

const HowToUseGuide: React.FC<HowToUseGuideProps> = ({ language }) => {
    const currentContent = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS['English'];

    return (
        <div className="w-full max-w-3xl mx-auto my-8 p-6 bg-amber-100/60 rounded-xl shadow-md border border-amber-300/50 animate-fade-in">
            <h3 className="text-xl font-bold text-center text-amber-900 mb-4 font-playfair">
                {currentContent.title}
            </h3>
            <div className="text-left leading-relaxed text-slate-700 space-y-3">
                {currentContent.text.map((paragraph, index) => (
                    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
            </div>
            {currentContent.rotation && (
                <div className="mt-6">
                    <h4 className="text-xl font-bold text-amber-900 mb-2">{currentContent.rotation.title}</h4>
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
    );
};

export default HowToUseGuide;