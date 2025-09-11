import React from 'react';

const TRANSLATIONS: Record<string, { title: string; content: string[]; acceptButton: string; }> = {
    'English': {
        title: 'A Spiritual Warning on Karmic Law',
        content: [
            "You have entered a domain of profound, yet sensitive knowledge. The principles described here operate under strict spiritual and karmic laws. Both Vedic and Buddhist traditions teach that every action (Karma) driven by intention (Cetana) creates a result.",
            "<strong>Vedic Law:</strong> As you sow, so shall you reap. Using this knowledge to harm, manipulate, or control others for selfish gain will create negative karma that will inevitably return to you, bringing suffering and misfortune.",
            "<strong>Buddhist Law:</strong> Unwholesome intentions (rooted in greed, hatred, and delusion) lead to suffering for oneself and others. Using this knowledge inflates the ego and creates attachments, deepening the cycle of rebirth and suffering (Samsara).",
            "<strong>Proceed with utmost respect, pure intention, and for the purpose of understanding only. Misuse of this knowledge for egoistic or harmful purposes is a grave spiritual transgression. The consequences are inescapable.</strong>"
        ],
        acceptButton: "I Understand and Accept"
    },
    'Sinhala': {
        title: 'කර්ම නීතිය පිළිබඳ අධ්‍යාත්මික අනතුරු ඇඟවීමක්',
        content: [
            "ඔබ ගැඹුරු, එහෙත් සංවේදී දැනුම් ක්ෂේත්‍රයකට பிரவேசித்துள்ளீர்கள். මෙහි විස්තර කර ඇති මූලධර්ම දැඩි අධ්‍යාත්මික සහ කර්ම නීති යටතේ ක්‍රියාත්මක වේ. වේද සහ බෞද්ධ සම්ප්‍රදායන් දෙකම උගන්වන්නේ චේතනාව (စေတနာ) මගින් මෙහෙයවනු ලබන සෑම ක්‍රියාවක්ම (කර්මය) ප්‍රතිඵලයක් ඇති කරන බවයි.",
            "<strong>වෛදික නීතිය:</strong> ඔබ වපුරන දෙයම නෙළාගනු ඇත. ආත්මාර්ථකාමී ලාභ සඳහා අන් අයට හානි කිරීමට, හැසිරවීමට හෝ පාලනය කිරීමට මෙම දැනුම භාවිතා කිරීම, ඔබට දුක් වේදනා සහ අවාසනාව ගෙන එන ඍණාත්මක කර්මයක් නිර්මාණය කරනු ඇත.",
            "<strong>බෞද්ධ නීතිය:</strong> අකුසල චේතනා (ලෝභ, ද්වේෂ, මෝහ තුළ මුල් බැසගත්) තමාට සහ අනුන්ට දුකට හේතු වේ. මෙම දැනුම භාවිතා කිරීම අහංකාරය වර්ධනය කර බැඳීම් ඇති කරයි, සංසාරයේ දුක්ඛ චක්‍රය ගැඹුරු කරයි.",
            "<strong>ඉතා ගෞරවයෙන්, පිරිසිදු චේතනාවෙන් සහ අවබෝධය සඳහා පමණක් ඉදිරියට යන්න. අහංකාර හෝ හානිකර අරමුණු සඳහා මෙම දැනුම අනිසි ලෙස භාවිතා කිරීම බරපතල අධ්‍යාත්මික වරදකි. එහි ප්‍රතිවිපාකවලින් ගැලවීමක් නැත.</strong>"
        ],
        acceptButton: "මම තේරුම් ගෙන පිළිගනිමි"
    },
    'Tamil': {
        title: 'கர்மா சட்டம் குறித்த ஆன்மீக எச்சரிக்கை',
        content: [
            "நீங்கள் ஆழ்ந்த, ஆனால் உணர்திறன் மிக்க அறிவு களத்தில் நுழைந்துள்ளீர்கள். இங்கு விவரிக்கப்பட்டுள்ள கோட்பாடுகள் கடுமையான ஆன்மீக மற்றும் கர்மா விதிகளின் கீழ் செயல்படுகின்றன. வேத மற்றும் பௌத்த மரபுகள் இரண்டும், நோக்கத்தால் (சேதனா) இயக்கப்படும் ஒவ்வொரு செயலும் (கர்மா) ஒரு விளைவை உருவாக்குகிறது என்று கற்பிக்கின்றன.",
            "<strong>வேத விதி:</strong> நீங்கள் விதைப்பதைத்தான் அறுவடை செய்வீர்கள். சுயநல ஆதாயத்திற்காக மற்றவர்களுக்குத் தீங்கு விளைவிக்கவும், கையாளவும் அல்லது கட்டுப்படுத்தவும் இந்த அறிவைப் பயன்படுத்துவது, உங்களுக்குத் துன்பத்தையும் துரதிர்ஷ்டத்தையும் தரும் எதிர்மறையான கர்மாவை உருவாக்கும்.",
            "<strong>பௌத்த விதி:</strong> தீய நோக்கங்கள் (பேராசை, வெறுப்பு மற்றும் அறியாமையில் வேரூன்றியவை) தனக்கும் மற்றவர்களுக்கும் துன்பத்திற்கு வழிவகுக்கும். இந்த அறிவைப் பயன்படுத்துவது அகந்தையை வளர்த்து, பற்றுதல்களை உருவாக்குகிறது, பிறப்பு மற்றும் துன்பத்தின் சுழற்சியை (சம்சாரம்) ஆழமாக்குகிறது.",
            "<strong>மிகுந்த மரியாதையுடனும், தூய நோக்கத்துடனும், புரிந்துகொள்ளும் நோக்கத்திற்காக மட்டுமே தொடரவும். அகங்கார அல்லது தீங்கு விளைவிக்கும் நோக்கங்களுக்காக இந்த அறிவைத் தவறாகப் பயன்படுத்துவது ஒரு கடுமையான ஆன்மீக மீறலாகும். அதன் விளைவுகளிலிருந்து தப்ப முடியாது.</strong>"
        ],
        acceptButton: "நான் புரிந்துகொண்டு ஏற்றுக்கொள்கிறேன்"
    },
    'Hindi': {
        title: 'कर्म के नियम पर एक आध्यात्मिक चेतावनी',
        content: [
            "आपने गहन, फिर भी संवेदनशील ज्ञान के क्षेत्र में प्रवेश किया है। यहाँ वर्णित सिद्धांत कठोर आध्यात्मिक और कर्म के नियमों के तहत संचालित होते हैं। वैदिक और बौद्ध दोनों परंपराएँ सिखाती हैं कि इरादे (चेतना) से प्रेरित प्रत्येक क्रिया (कर्म) एक परिणाम उत्पन्न करती है।",
            "<strong>वैदिक नियम:</strong> जैसा बोओगे, वैसा काटोगे। स्वार्थी लाभ के लिए दूसरों को नुकसान पहुँचाने, हेरफेर करने या नियंत्रित करने के लिए इस ज्ञान का उपयोग करने से नकारात्मक कर्म उत्पन्न होंगे जो अनिवार्य रूप से आपके पास वापस आएँगे, जिससे दुख और दुर्भाग्य आएगा।",
            "<strong>बौद्ध नियम:</strong> अकुशल इरादे (लालच, घृणा और भ्रम में निहित) स्वयं और दूसरों के लिए दुख का कारण बनते हैं। इस ज्ञान का उपयोग अहंकार को बढ़ाता है और आसक्ति पैदा करता है, जिससे पुनर्जन्म और दुख (संसार) का चक्र गहरा होता है।",
            "<strong>अत्यंत सम्मान, शुद्ध इरादे और केवल समझने के उद्देश्य से आगे बढ़ें। अहंकारपूर्ण या हानिकारक उद्देश्यों के लिए इस ज्ञान का दुरुपयोग एक गंभीर आध्यात्मिक अपराध है। इसके परिणाम अपरिहार्य हैं।</strong>"
        ],
        acceptButton: "मैं समझता हूँ और स्वीकार करता हूँ"
    },
    'Malayalam': {
        title: "കർമ്മ നിയമത്തെക്കുറിച്ചുള്ള ഒരു ആത്മീയ മുന്നറിയിപ്പ്",
        content: [
            "നിങ്ങൾ അഗാധവും എന്നാൽ സൂക്ഷ്മവുമായ വിജ്ഞാനത്തിന്റെ ഒരു മേഖലയിൽ പ്രവേശിച്ചിരിക്കുന്നു. ഇവിടെ വിവരിച്ചിരിക്കുന്ന തത്വങ്ങൾ കർശനമായ ആത്മീയവും കാർമ്മികവുമായ നിയമങ്ങൾക്ക് കീഴിലാണ് പ്രവർത്തിക്കുന്നത്. വൈദികവും ബൗദ്ധവുമായ പാരമ്പര്യങ്ങൾ പഠിപ്പിക്കുന്നത്, ഉദ്ദേശ്യത്താൽ (ചേതന) നയിക്കപ്പെടുന്ന ഓരോ പ്രവൃത്തിക്കും (കർമ്മം) ഒരു ഫലമുണ്ടെന്നാണ്.",
            "<strong>വൈദിക നിയമം:</strong> നിങ്ങൾ വിതയ്ക്കുന്നത് നിങ്ങൾ കൊയ്യും. സ്വാർത്ഥ ലാภത്തിനായി മറ്റുള്ളവരെ ഉപദ്രവിക്കാനോ, കബളിപ്പിക്കാനോ, നിയന്ത്രിക്കാനോ ഈ അറിവ് ഉപയോഗിക്കുന്നത് നിങ്ങൾക്ക് ദുരിതവും ദൗർഭാഗ്യവും വരുത്തിവെക്കുന്ന നെഗറ്റീവ് കർമ്മം സൃഷ്ടിക്കും.",
            "<strong>ബൗദ്ധ നിയമം:</strong> അനാരോഗ്യകരമായ ഉദ്ദേശ്യങ്ങൾ (അത്യാഗ്രഹം, വെറുപ്പ്, വ്യാമോഹം എന്നിവയിൽ വേരൂന്നിയത്) തനിക്കും മറ്റുള്ളവർക്കും ദുരിതത്തിലേക്ക് നയിക്കുന്നു. ഈ അറിവ് ഉപയോഗിക്കുന്നത് അഹംഭാവം വർദ്ധിപ്പിക്കുകയും ബന്ധനങ്ങൾ സൃഷ്ടിക്കുകയും ചെയ്യുന്നു, ഇത് പുനർജന്മത്തിന്റെയും ദുരിതത്തിന്റെയും (സംസാരം) ചക്രം ആഴത്തിലാക്കുന്നു.",
            "<strong>അങ്ങേയറ്റം ബഹുമാനത്തോടെയും, ശുദ്ധമായ ഉദ്ദേശ്യത്തോടെയും, മനസ്സിലാക്കുന്നതിന് വേണ്ടി മാത്രം മുന്നോട്ട് പോകുക. അഹംഭാവപരമോ ദോഷകരമോ ആയ ഉദ്ദേശ്യങ്ങൾക്കായി ഈ അറിവ് ദുരുപയോഗം ചെയ്യുന്നത് ഗുരുതരമായ ആത്മീയ നിയമലംഘനമാണ്. അതിന്റെ അനന്തരഫലങ്ങൾ ഒഴിവാക്കാനാവില്ല.</strong>"
        ],
        acceptButton: "ഞാൻ മനസ്സിലാക്കി അംഗീകരിക്കുന്നു"
    }
};

const LANGUAGES = ["English", "Sinhala", "Tamil", "Hindi", "Malayalam"];

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

interface KarmicWarningModalProps {
    language: string;
    setLanguage: (lang: string) => void;
    onClose: () => void;
}

const KarmicWarningModal: React.FC<KarmicWarningModalProps> = ({ language, setLanguage, onClose }) => {
    const currentContent = TRANSLATIONS[language as keyof typeof TRANSLATIONS] || TRANSLATIONS['English'];

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
            onClick={onClose}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="warning-title"
        >
          <div 
            className="bg-[var(--bg-panel-color)] rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col p-6 border border-[var(--border-color)]"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-between items-center pb-4 border-b border-[var(--border-color)]">
                <h2 id="warning-title" className="text-2xl font-bold text-red-400 font-playfair">{currentContent.title}</h2>
                <button 
                    onClick={onClose} 
                    className="text-[var(--text-secondary)] hover:text-white transition-colors p-1 rounded-full hover:bg-black/20"
                    aria-label="Close"
                >
                   <CloseIcon />
                </button>
            </header>

            <div className="mt-4 flex flex-wrap justify-center gap-2 mb-4">
                {LANGUAGES.map(lang => (
                    <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-color)] focus:ring-[var(--accent-color)] ${
                            language === lang
                                ? 'bg-[var(--accent-color)] text-white shadow-md'
                                : 'bg-black/20 text-[var(--text-secondary)] hover:bg-black/40'
                        }`}
                        aria-pressed={language === lang}
                    >
                        {lang}
                    </button>
                ))}
            </div>

            <div className="mt-4 flex-grow overflow-y-auto pr-2 space-y-4 text-[var(--text-primary)] max-h-[50vh]">
                {currentContent.content.map((paragraph, index) => (
                    <p key={index} dangerouslySetInnerHTML={{ __html: paragraph }} />
                ))}
            </div>

             <div className="mt-6 pt-4 border-t border-[var(--border-color)] flex justify-end">
                <button
                    onClick={onClose}
                    className="px-6 py-2 font-semibold rounded-full text-white bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-panel-color)] focus:ring-[var(--accent-color)]"
                >
                    {currentContent.acceptButton}
                </button>
            </div>
          </div>
        </div>
    );
};

export default KarmicWarningModal;