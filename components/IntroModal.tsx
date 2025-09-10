import React, { useState } from 'react';

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const TRANSLATIONS = {
  'English': {
      aboutTitle: 'What is Soundarya Lahari?',
      aboutText: 'Soundarya Lahari, meaning "Waves of Beauty," is a revered ancient text of 100 verses (slokas) celebrating the beauty, grace, and power of the Divine Mother, Goddess Parvati or Shakti. Attributed to the great philosopher and saint Adi Shankaracharya, it is a cornerstone of Shri Vidya tradition. The text is divided into two parts: the <strong>Ananda Lahari</strong> (first 41 verses), focusing on the blissful union of Shiva and Shakti and the esoteric aspects of Shri Chakra worship, and the <strong>Soundarya Lahari</strong> (remaining 59 verses), which exquisitely describes the physical and divine beauty of the Goddess from head to toe. Each verse is not just a poem but a powerful mantra, believed to grant specific spiritual and material benefits when recited with devotion. This application serves as a guide to unlock the profound wisdom within these verses, helping you find the right mantra for your specific intentions.',
      tableTitle: 'Bija Mantras in Soundarya Lahari',
      tableHeaders: { mantra: 'Bija Mantra', energy: 'Primary Energy', usage: 'Brief Usage' },
      bijaMantras: [
          { mantra: 'ॐ (Om)', energy: 'Primordial Sound', usage: 'For control of the senses, physical energy, and connection with the universe.' },
          { mantra: 'ऐं (Aim)', energy: 'Knowledge & Speech', usage: 'To enhance knowledge, eloquence, and artistic abilities.' },
          { mantra: 'ह्रीं (Hreem)', energy: 'Universal Energy', usage: 'For influence, dispelling illusion, purification, and connecting with universal energy.' },
          { mantra: 'क्लीं (Kleem)', energy: 'Energy of Attraction', usage: 'For prosperity, attraction, strengthening relationships, and overcoming enemies.' },
          { mantra: 'श्रीं (Shreem)', energy: 'Wealth & Prosperity', usage: 'To attain wealth, knowledge, academic success, and abundance.' },
          { mantra: 'दुं (Dum)', energy: 'Protection', usage: 'For protection from diseases, fear, and poverty.' },
          { mantra: 'सौः (Sauh)', energy: 'Supreme Consciousness', usage: 'To attain intelligence, eloquence, and higher spiritual states.' },
          { mantra: 'क्रों (KrOM)', energy: 'Potent Action', usage: 'Used to gain mastery over natural forces.' },
          { mantra: 'रं (Ram)', energy: 'Fire (Agni)', usage: 'For freedom from attachments and debts, and fulfillment of desires.' },
          { mantra: 'यं (Yam)', energy: 'Air (Vayu)', usage: 'To control natural elements, foster harmony, and improve relationships.' },
          { mantra: 'वं (Vam)', energy: 'Water (Jala)', usage: 'To gain scriptural knowledge and proficiency in various languages.' },
          { mantra: 'लं (Lam)', energy: 'Earth (Prithvi)', usage: 'For grounding, stability, and material security.' },
          { mantra: 'हं (Ham)', energy: 'Ether (Akasha)', usage: 'For nourishment, abundance, and connection to the etheric realm.' },
          { mantra: 'सं (Sam)', energy: 'Creativity', usage: 'To develop poetic imagination and creative intellect.' },
          { mantra: 'कं (Kam)', energy: 'Happiness & Healing', usage: 'For promoting joy, contentment, and healing.' },
          { mantra: 'थं (Tham)', energy: 'Negation / Stilling', usage: 'Used to stop or still negative forces, diseases, and obstacles.' },
          { mantra: 'गं (Gam)', energy: 'Ganesha / Obstacle Removal', usage: 'Removes obstacles and paves the way for success.' },
          { mantra: 'ह्स्रौँ (Hsraum)', energy: 'Spiritual Transformation', usage: 'For spiritual transformation, protection, and higher consciousness.' },
          { mantra: 'क्षं (Ksham)', energy: 'Completion & Forgiveness', usage: 'Promotes forgiveness, patience, and the ability to complete tasks.' },
          { mantra: 'भं (Bham)', energy: 'Fiery Transformation (Mars)', usage: 'Invokes a fiery, transformative energy for courage and action.' },
          { mantra: 'नं (Nam)', energy: 'Liberation & Detachment', usage: 'Aids in achieving liberation, detachment, and dispelling ego.' },
          { mantra: 'सूं (Soom)', energy: 'Lunar Energy', usage: 'Connects with lunar energy for nourishment, healing, and intuition.' },
          { mantra: 'हूं (Hoom)', energy: 'Protection / Destruction of Negativity', usage: 'A powerful mantra for protection and forceful destruction of negativity.' },
          { mantra: 'फट् (Phat)', energy: 'Dispelling Negative Forces', usage: 'Used to energetically cut through and dispel negative forces or obstacles.' },
          { mantra: 'जं (Jam)', energy: 'Mental Clarity', usage: 'Enhances mental clarity, wisdom, and intellectual power.' },
          { mantra: 'शं (Sham)', energy: 'Peace & Tranquility', usage: 'Invokes peace, tranquility, and well-being.' },
          { mantra: 'टं (Tam)', energy: 'Lunar Influence', usage: 'Relates to lunar influence, intuition, and inner reflection.' },
          { mantra: 'पं (Pam)', energy: 'Planetary Harmony', usage: 'Helps in harmonizing planetary influences and energies.' },
      ]
  },
  'Sinhala': {
      aboutTitle: 'සෞන්දර්ය ලහරි යනු කුමක්ද?',
      aboutText: '"සෞන්දර්ය ලහරි", යනු "සුන්දරත්ව ලහරි" යන අරුත දෙන, දේව මාතාව, පාර්වතී දේවිය නොහොත් ශක්තියේ සුන්දරත්වය, කරුණාව සහ බලය සමරන ගෞරවනීය පුරාණ ග්‍රන්ථයකි. ශ්‍රේෂ්ඨ දාර්ශනිකයෙකු සහ ශාන්තුවරයෙකු වූ ආදි ශංකරාචාර්යයන්ට ආරෝපණය කර ඇති මෙය ශ්‍රී විද්‍යා සම්ප්‍රදායේ මූලික ගලක් වේ. මෙම ග්‍රන්ථය කොටස් දෙකකට බෙදා ඇත: <strong>ආනන්ද ලහරි</strong> (පළමු ශ්ලෝක 41), ශිව සහ ශක්තිගේ ප්‍රීතිමත් එක්වීම සහ ශ්‍රී චක්‍ර වන්දනාවේ ගුප්ත අංශ කෙරෙහි අවධානය යොමු කරයි, සහ <strong>සෞන්දර්ය ලහරි</strong> (ඉතිරි ශ්ලෝක 59), දේවියගේ ශාරීරික හා දිව්‍යමය සුන්දරත්වය හිසේ සිට පාදාන්තය දක්වා විස්තර කරයි. සෑම ශ්ලෝකයක්ම හුදෙක් කවියක් පමණක් නොව, භක්තියෙන් යුතුව පාරායනය කළ විට, විශේෂිත අධ්‍යාත්මික සහ භෞතික ප්‍රතිලාභ ලබා දෙන බවට විශ්වාස කෙරෙන බලවත් මන්ත්‍රයකි. මෙම යෙදුම මෙම ශ්ලෝක තුළ ඇති ගැඹුරු ප්‍රඥාව විවෘත කිරීමට මාර්ගෝපදේශයක් ලෙස ක්‍රියා කරයි, ඔබේ නිශ්චිත අභිප්‍රායන් සඳහා නිවැරදි මන්ත්‍රය සොයා ගැනීමට ඔබට උපකාරී වේ.',
      tableTitle: 'සෞන්දර්ය ලහරි ග්‍රන්ථයේ බීජ මන්ත්‍ර',
      tableHeaders: { mantra: 'බීජ මන්ත්‍රය', energy: 'ප්‍රධාන ශක්තිය', usage: 'සංක්ෂිප්ත භාවිතය' },
      bijaMantras: [
          { mantra: 'ॐ (Om)', energy: 'විශ්වයේ මූලික ශබ්දය', usage: 'ඉන්ද්‍රියන් පාලනය, ශාරීරික ශක්තිය සහ විශ්වය හා සම්බන්ධ වීම සඳහා.' },
          { mantra: 'ऐं (Aim)', energy: 'දැනුම සහ කථනය', usage: 'දැනුම, චතුර කථිකත්වය සහ කලාත්මක හැකියාවන් වර්ධනය කිරීමට.' },
          { mantra: 'ह्रीं (Hreem)', energy: 'විශ්ව ශක්තිය', usage: 'බලපෑම් කිරීමේ හැකියාව, මායාව දුරු කිරීම, පවිත්‍ර වීම සහ විශ්ව ශක්තිය හා සම්බන්ධ වීම සඳහා.' },
          { mantra: 'क्लीं (Kleem)', energy: 'ආකර්ෂණ ශක්තිය', usage: 'සමෘද්ධිය, ආකර්ෂණය, සබඳතා ශක්තිමත් කිරීම සහ සතුරන් ජය ගැනීම සඳහා.' },
          { mantra: 'श्रीं (Shreem)', energy: 'ධනය සහ සෞභාග්‍යය', usage: 'ධනය, දැනුම, අධ්‍යාපන සාර්ථකත්වය සහ සශ්‍රීකත්වය ළඟා කර ගැනීම සඳහා.' },
          { mantra: 'दुं (Dum)', energy: 'ආරක්ෂාව', usage: 'රෝග, බිය සහ දරිද්‍රතාවයෙන් ආරක්ෂා වීම සඳහා.' },
          { mantra: 'सौः (Sauh)', energy: 'උත්තරීතර විඥානය', usage: 'බුද්ධිය, කථිකත්වය සහ ඉහළ අධ්‍යාත්මික තලයන් කරා ළඟා වීම සඳහා.' },
          { mantra: 'क्रों (KrOM)', energy: 'ශක්තිමත් ක්‍රියාව', usage: 'ස්වභාවික බලවේග කෙරෙහි ආධිපත්‍යය ලබා ගැනීම සඳහා යොදා ගැනේ.' },
          { mantra: 'रं (Ram)', energy: 'ගිනි (අග්නි)', usage: 'බැඳීම් සහ ණයවලින් මිදීම, සහ ආශාවන් ඉටුකර ගැනීම සඳහා.' },
          { mantra: 'यं (Yam)', energy: 'වාතය (වායු)', usage: 'ස්වභාවික මූලද්‍රව්‍ය පාලනය, සමගිය පෝෂණය කිරීම සහ සබඳතා යහපත් කර ගැනීම සඳහා.' },
          { mantra: 'वं (Vam)', energy: 'ජලය (ජල)', usage: 'ශාස්ත්‍රීය දැනුම සහ විවිධ භාෂා පිළිබඳ නිපුණත්වය ලබා ගැනීම සඳහා.' },
          { mantra: 'लं (Lam)', energy: 'පෘථිවිය (පෘථිවි)', usage: 'භූගත වීම, ස්ථාවරත්වය සහ භෞතික ආරක්ෂාව සඳහා.' },
          { mantra: 'हं (Ham)', energy: 'ඊතර් (ආකාශ)', usage: 'පෝෂණය, බහුලත්වය සහ ඊතරික ක්ෂේත්‍රය හා සම්බන්ධ වීම සඳහා.' },
          { mantra: 'सं (Sam)', energy: 'නිර්මාණශීලීත්වය', usage: 'කාව්‍යමය පරිකල්පනය සහ නිර්මාණශීලී බුද්ධිය වර්ධනය කිරීම සඳහා.' },
          { mantra: 'कं (Kam)', energy: 'සතුට සහ සුවය', usage: 'ප්‍රීතිය, තෘප්තිය සහ සුවය ප්‍රවර්ධනය කිරීම සඳහා.' },
          { mantra: 'थं (Tham)', energy: 'ප්‍රතික්ෂේප කිරීම / නිශ්චල කිරීම', usage: 'සෘණාත්මක බලවේග, රෝග සහ බාධක නැවැත්වීමට හෝ නිශ්චල කිරීමට යොදා ගැනේ.' },
          { mantra: 'गं (Gam)', energy: 'ගණ දෙවියන් / බාධක ඉවත් කිරීම', usage: 'බාධක ඉවත් කර සාර්ථකත්වයට මග පාදයි.' },
          { mantra: 'ह्स्रौँ (Hsraum)', energy: 'ආධ්‍යාත්මික පරිවර්තනය', usage: 'ආධ්‍යාත්මික පරිවර්තනය, ආරක්ෂාව සහ ඉහළ විඥානය සඳහා.' },
          { mantra: 'क्षं (Ksham)', energy: 'සම්පූර්ණ කිරීම සහ සමාව දීම', usage: 'සමාව දීම, ඉවසීම සහ කාර්යයන් සම්පූර්ණ කිරීමේ හැකියාව ප්‍රවර්ධනය කරයි.' },
          { mantra: 'भं (Bham)', energy: 'ගිනිමය පරිවර්තනය (අඟහරු)', usage: 'ධෛර්යය සහ ක්‍රියාව සඳහා ගිනිමය, පරිවර්තනීය ශක්තියක් ආයාචනා කරයි.' },
          { mantra: 'नं (Nam)', energy: 'විමුක්තිය සහ වෙන්වීම', usage: 'විමුක්තිය, වෙන්වීම සහ අහංකාරය දුරු කිරීමට උපකාරී වේ.' },
          { mantra: 'सूं (Soom)', energy: 'චන්ද්‍ර ශක්තිය', usage: 'පෝෂණය, සුවය සහ සහජ බුද්ධිය සඳහා චන්ද්‍ර ශක්තිය හා සම්බන්ධ වේ.' },
          { mantra: 'हूं (Hoom)', energy: 'ආරක්ෂාව / සෘණාත්මක බව විනාශ කිරීම', usage: 'ආරක්ෂාව සහ සෘණාත්මක බව බලහත්කාරයෙන් විනාශ කිරීම සඳහා ප්‍රබල මන්ත්‍රයකි.' },
          { mantra: 'फट् (Phat)', energy: 'සෘණාත්මක බලවේග දුරු කිරීම', usage: 'සෘණාත්මක බලවේග හෝ බාධක ජවසම්පන්න ලෙස කපා හැරීමට සහ දුරු කිරීමට යොදා ගැනේ.' },
          { mantra: 'जं (Jam)', energy: 'මානසික පැහැදිලිතාව', usage: 'මානසික පැහැදිලිතාව, ප්‍රඥාව සහ බුද්ධිමය බලය වර්ධනය කරයි.' },
          { mantra: 'शं (Sham)', energy: 'සාමය සහ සන්සුන්කම', usage: 'සාමය, සන්සුන්කම සහ යහපැවැත්ම ආයාචනා කරයි.' },
          { mantra: 'टं (Tam)', energy: 'චන්ද්‍ර බලපෑම', usage: 'චන්ද්‍ර බලපෑම, සහජ බුද්ධිය සහ අභ්‍යන්තර මෙනෙහි කිරීමට සම්බන්ධ වේ.' },
          { mantra: 'पं (Pam)', energy: 'ග්‍රහ සමගිය', usage: 'ග්‍රහ බලපෑම් සහ ශක්තීන් සමගි කිරීමට උපකාරී වේ.' },
      ]
  },
  'Tamil': {
      aboutTitle: 'சௌந்தர்ய லஹரி என்றால் என்ன?',
      aboutText: '"சௌந்தர்ய லஹரி", அதாவது "அழகின் அலைகள்", என்பது தெய்வீக அன்னை, பார்வதி தேவி அல்லது சக்தியின் அழகு, கருணை மற்றும் சக்தியைக் கொண்டாடும் 100 ஸ்லோகங்களைக் கொண்ட ஒரு மரியாதைக்குரிய பண்டைய நூலாகும். பெரும் தத்துவஞானியும் புனிதருமான ஆதி சங்கரரால் இயற்றப்பட்டதாகக் கருதப்படும் இது, ஸ்ரீ வித்யா பாரம்பரியத்தின் ஒரு மூலக்கல்லாகும். இந்த நூல் இரண்டு பகுதிகளாகப் பிரிக்கப்பட்டுள்ளது: <strong>ஆனந்த லஹரி</strong> (முதல் 41 ஸ்லோகங்கள்), சிவன் மற்றும் சக்தியின் ஆனந்தமான ένωση மற்றும் ஸ்ரீ சக்ர வழிபாட்டின் மறைபொருள் அம்சங்களில் கவனம் செலுத்துகிறது, மற்றும் <strong>சௌந்தர்ய லஹரி</strong> (மீதமுள்ள 59 ஸ்லோகங்கள்), இது தேவியின் உடல் மற்றும் தெய்வீக அழகை தலையிலிருந்து கால் வரை அற்புதமாக விவரிக்கிறது. ஒவ்வொரு ஸ்லோகமும் ஒரு கவிதை மட்டுமல்ல, பக்தியுடன் ஓதும்போது, குறிப்பிட்ட ஆன்மீக மற்றும் உலகியல் நன்மைகளை வழங்குவதாக நம்பப்படும் ஒரு சக்திவாய்ந்த மந்திரமாகும். இந்த பயன்பாடு இந்த ஸ்லோகங்களில் உள்ள ஆழ்ந்த ஞானத்தைத் திறப்பதற்கான ஒரு வழிகாட்டியாக செயல்படுகிறது, உங்கள் குறிப்பிட்ட நோக்கங்களுக்காக சரியான மந்திரத்தைக் கண்டறிய உதவுகிறது.',
      tableTitle: 'சௌந்தர்ய லஹரியில் உள்ள பீஜ மந்திரங்கள்',
      tableHeaders: { mantra: 'பீஜ மந்திரம்', energy: 'முதன்மை ஆற்றல்', usage: 'சுருக்கமான பயன்பாடு' },
      bijaMantras: [
          { mantra: 'ॐ (Om)', energy: 'பிரபஞ்சத்தின் ஆதி ஒலி', usage: 'புலன்களைக் கட்டுப்படுத்த, உடல் ஆற்றல் மற்றும் பிரபஞ்சத்துடன் இணைவதற்கு.' },
          { mantra: 'ऐं (Aim)', energy: 'அறிவு மற்றும் பேச்சு', usage: 'அறிவு, வாக்கு வன்மை மற்றும் கலைத் திறன்களை மேம்படுத்த.' },
          { mantra: 'ह्रीं (Hreem)', energy: 'பிரபஞ்ச ஆற்றல்', usage: 'செல்வாக்கு செலுத்த, மாயையை அகற்ற, சுத்திகரிக்க மற்றும் பிரபஞ்ச ஆற்றலுடன் இணைய.' },
          { mantra: 'क्लीं (Kleem)', energy: 'ஈர்ப்பு ஆற்றல்', usage: 'வளம், ஈர்ப்பு, உறவுகளை வலுப்படுத்த மற்றும் எதிரிகளை வெல்ல.' },
          { mantra: 'श्रीं (Shreem)', energy: 'செல்வம் மற்றும் வளம்', usage: 'செல்வம், அறிவு, கல்வி வெற்றி மற்றும் செழிப்பை அடைய.' },
          { mantra: 'दुं (Dum)', energy: 'பாதுகாப்பு', usage: 'நோய்கள், பயம் மற்றும் வறுமையிலிருந்து பாதுகாக்க.' },
          { mantra: 'सौः (Sauh)', energy: 'உயர் உணர்வுநிலை', usage: 'அறிவு, வாக்கு வன்மை மற்றும் உயர் ஆன்மீக நிலைகளை அடைய.' },
          { mantra: 'क्रों (KrOM)', energy: 'சக்திவாய்ந்த செயல்', usage: 'இயற்கை சக்திகளின் மீது தேர்ச்சி பெறப் பயன்படுகிறது.' },
          { mantra: 'रं (Ram)', energy: 'நெருப்பு (அக்னி)', usage: 'பற்றுகள் மற்றும் கடன்களிலிருந்து விடுபட, மற்றும் ஆசைகளை நிறைவேற்ற.' },
          { mantra: 'यं (Yam)', energy: 'காற்று (வாயு)', usage: 'இயற்கை கூறுகளைக் கட்டுப்படுத்த, நல்லிணக்கத்தை வளர்க்க மற்றும் உறவுகளை மேம்படுத்த.' },
          { mantra: 'वं (Vam)', energy: 'நீர் (ஜலம்)', usage: 'சாஸ்திர அறிவு மற்றும் பல்வேறு மொழிகளில் தேர்ச்சி பெற.' },
          { mantra: 'लं (Lam)', energy: 'பூமி (பிருத்வி)', usage: 'நிலையாக இருக்க, ஸ்திரத்தன்மை மற்றும் பொருள் பாதுகாப்புக்கு.' },
          { mantra: 'हं (Ham)', energy: 'ஆகாயம் (ஆகாஷா)', usage: 'ஊட்டம், செழிப்பு மற்றும் ஆகாய மண்டலத்துடன் இணைய.' },
          { mantra: 'सं (Sam)', energy: 'படைப்பாற்றல்', usage: 'கவிதை கற்பனை மற்றும் படைப்பு அறிவை வளர்க்க.' },
          { mantra: 'कं (Kam)', energy: ' மகிழ்ச்சி மற்றும் குணப்படுத்துதல்', usage: 'மகிழ்ச்சி, மனநிறைவு மற்றும் குணப்படுத்துதலை ஊக்குவிக்க.' },
          { mantra: 'थं (Tham)', energy: 'எதிர்மறை / நிறுத்துதல்', usage: 'எதிர்மறை சக்திகள், நோய்கள் மற்றும் தடைகளை நிறுத்த அல்லது ساکதமாக்கப் பயன்படுகிறது.' },
          { mantra: 'गं (Gam)', energy: 'கணேசர் / தடை நீக்கம்', usage: 'தடைகளை நீக்கி வெற்றிக்கு வழி வகுக்கிறது.' },
          { mantra: 'ह्स्रौँ (Hsraum)', energy: 'ஆன்மீக மாற்றம்', usage: 'ஆன்மீக மாற்றம், பாதுகாப்பு மற்றும் உயர் உணர்வுநிலைக்கு.' },
          { mantra: 'क्षं (Ksham)', energy: 'நிறைவு மற்றும் மன்னிப்பு', usage: 'மன்னிப்பு, பொறுமை மற்றும் பணிகளை முடிக்கும் திறனை ஊக்குவிக்கிறது.' },
          { mantra: 'भं (Bham)', energy: 'தீவிர மாற்றம் (செவ்வாய்)', usage: 'தைரியம் மற்றும் செயலுக்காக ஒரு தீவிர, மாற்றும் ஆற்றலை வரவழைக்கிறது.' },
          { mantra: 'नं (Nam)', energy: 'விடுதலை மற்றும் பற்றின்மை', usage: 'விடுதலை, பற்றின்மை மற்றும் அகந்தையை அகற்ற உதவுகிறது.' },
          { mantra: 'सूं (Soom)', energy: 'சந்திர ஆற்றல்', usage: 'ஊட்டம், குணப்படுத்துதல் மற்றும் உள்ளுணர்வுக்காக சந்திர ஆற்றலுடன் இணைகிறது.' },
          { mantra: 'हूं (Hoom)', energy: 'பாதுகாப்பு / எதிர்மறை அழிப்பு', usage: 'பாதுகாப்பிற்கும், எதிர்மறையை வலுக்கட்டாயமாக அழிப்பதற்கும் ஒரு சக்திவாய்ந்த மந்திரம்.' },
          { mantra: 'फट् (Phat)', energy: 'எதிர்மறை சக்திகளை விரட்டுதல்', usage: 'எதிர்மறை சக்திகள் அல்லது தடைகளை ஆற்றலுடன் வெட்டி விரட்டப் பயன்படுகிறது.' },
          { mantra: 'जं (Jam)', energy: 'மனத் தெளிவு', usage: 'மனத் தெளிவு, ஞானம் மற்றும் அறிவுசார் சக்தியை மேம்படுத்துகிறது.' },
          { mantra: 'शं (Sham)', energy: 'அமைதி மற்றும் சாந்தம்', usage: 'அமைதி, சாந்தம் மற்றும் நல்வாழ்வை வரவழைக்கிறது.' },
          { mantra: 'टं (Tam)', energy: 'சந்திர செல்வாக்கு', usage: 'சந்திர செல்வாக்கு, உள்ளுணர்வு மற்றும் உள் பிரதிபலிப்புடன் தொடர்புடையது.' },
          { mantra: 'पं (Pam)', energy: 'கிரக நல்லிணக்கம்', usage: 'கிரக தாக்கங்களையும் ஆற்றல்களையும் நல்லிணக்கப்படுத்த உதவுகிறது.' },
      ]
  },
  'Hindi': {
      aboutTitle: 'सौंदर्य लहरी क्या है?',
      aboutText: '"सौंदर्य लहरी", जिसका अर्थ है "सौंदर्य की लहरें", एक श्रद्धेय प्राचीन ग्रंथ है जिसमें 100 श्लोक हैं जो देवी माँ, देवी पार्वती या शक्ति की सुंदरता, कृपा और शक्ति का जश्न मनाते हैं। महान दार्शनिक और संत आदि शंकराचार्य द्वारा रचित, यह श्री विद्या परंपरा का एक आधारशिला है। यह ग्रंथ दो भागों में विभाजित है: <strong>आनंद लहरी</strong> (पहले 41 श्लोक), जो शिव और शक्ति के आनंदमय मिलन और श्री चक्र पूजा के गूढ़ पहलुओं पर ध्यान केंद्रित करता है, और <strong>सौंदर्य लहरी</strong> (शेष 59 श्लोक), जो देवी के शारीरिक और दिव्य सौंदर्य का सिर से पैर तक उत्कृष्ट वर्णन करता है। प्रत्येक श्लोक केवल एक कविता नहीं है, बल्कि एक शक्तिशाली मंत्र है, जिसके बारे में माना जाता है कि भक्ति के साथ पाठ करने पर विशिष्ट आध्यात्मिक और भौतिक लाभ मिलते हैं। यह एप्लिकेशन इन श्लोकों में निहित गहन ज्ञान को अनलॉक करने के लिए एक मार्गदर्शक के रूप में कार्य करता है, जिससे आपको अपने विशिष्ट इरादों के लिए सही मंत्र खोजने में मदद मिलती है।',
      tableTitle: 'सौंदर्य लहरी में बीज मंत्र',
      tableHeaders: { mantra: 'बीज मंत्र', energy: 'प्राथमिक ऊर्जा', usage: 'संक्षिप्त उपयोग' },
      bijaMantras: [
          { mantra: 'ॐ (Om)', energy: 'प्राथमिक ध्वनि', usage: 'इंद्रियों पर नियंत्रण, शारीरिक ऊर्जा और ब्रह्मांड से जुड़ाव के लिए।' },
          { mantra: 'ऐं (Aim)', energy: 'ज्ञान और वाणी', usage: 'ज्ञान, वाक्पटुता और कलात्मक क्षमताओं को बढ़ाने के लिए।' },
          { mantra: 'ह्रीं (Hreem)', energy: 'सार्वभौमिक ऊर्जा', usage: 'प्रभाव, भ्रम को दूर करने, शुद्धि और सार्वभौमिक ऊर्जा से जुड़ने के लिए।' },
          { mantra: 'क्लीं (Kleem)', energy: 'आकर्षण की ऊर्जा', usage: 'समृद्धि, आकर्षण, रिश्तों को मजबूत करने और दुश्मनों पर काबू पाने के लिए।' },
          { mantra: 'श्रीं (Shreem)', energy: 'धन और समृद्धि', usage: 'धन, ज्ञान, शैक्षणिक सफलता और प्रचुरता प्राप्त करने के लिए।' },
          { mantra: 'दुं (Dum)', energy: 'सुरक्षा', usage: 'बीमारियों, भय और गरीबी से सुरक्षा के लिए।' },
          { mantra: 'सौः (Sauh)', energy: 'सर्वोच्च चेतना', usage: 'बुद्धि, वाक्पटुता और उच्च आध्यात्मिक अवस्थाओं को प्राप्त करने के लिए।' },
          { mantra: 'क्रों (KrOM)', energy: 'शक्तिशाली क्रिया', usage: 'प्राकृतिक शक्तियों पर महारत हासिल करने के लिए उपयोग किया जाता है।' },
          { mantra: 'रं (Ram)', energy: 'अग्नि', usage: 'लगाव और कर्ज से मुक्ति, और इच्छाओं की पूर्ति के लिए।' },
          { mantra: 'यं (Yam)', energy: 'वायु', usage: 'प्राकृतिक तत्वों को नियंत्रित करने, सद्भाव को बढ़ावा देने और रिश्तों को बेहतर बनाने के लिए।' },
          { mantra: 'वं (Vam)', energy: 'जल', usage: 'शास्त्रीय ज्ञान और विभिन्न भाषाओं में प्रवीणता प्राप्त करने के लिए।' },
          { mantra: 'लं (Lam)', energy: 'पृथ्वी', usage: 'ग्राउंडिंग, स्थिरता और भौतिक सुरक्षा के लिए।' },
          { mantra: 'हं (Ham)', energy: 'आकाश', usage: 'पोषण, प्रचुरता और आकाशीय क्षेत्र से जुड़ाव के लिए।' },
          { mantra: 'सं (Sam)', energy: 'रचनात्मकता', usage: 'काव्यात्मक कल्पना और रचनात्मक बुद्धि विकसित करने के लिए।' },
          { mantra: 'कं (Kam)', energy: 'खुशी और उपचार', usage: 'खुशी, संतोष और उपचार को बढ़ावा देने के लिए।' },
          { mantra: 'थं (Tham)', energy: 'नकार / स्थिरीकरण', usage: 'नकारात्मक शक्तियों, बीमारियों और बाधाओं को रोकने या स्थिर करने के लिए उपयोग किया जाता है।' },
          { mantra: 'गं (Gam)', energy: 'गणेश / बाधा निवारण', usage: 'बाधाओं को दूर करता है और सफलता का मार्ग प्रशस्त करता है।' },
          { mantra: 'ह्स्रौँ (Hsraum)', energy: 'आध्यात्मिक परिवर्तन', usage: 'आध्यात्मिक परिवर्तन, सुरक्षा और उच्च चेतना के लिए।' },
          { mantra: 'क्षं (Ksham)', energy: 'पूर्णता और क्षमा', usage: 'क्षमा, धैर्य और कार्यों को पूरा करने की क्षमता को बढ़ावा देता है।' },
          { mantra: 'भं (Bham)', energy: 'उग्र परिवर्तन (मंगल)', usage: 'साहस और कार्रवाई के लिए एक उग्र, परिवर्तनकारी ऊर्जा का आह्वान करता है।' },
          { mantra: 'नं (Nam)', energy: 'मुक्ति और वैराग्य', usage: 'मुक्ति, वैराग्य और अहंकार को दूर करने में सहायता करता है।' },
          { mantra: 'सूं (Soom)', energy: 'चंद्र ऊर्जा', usage: 'पोषण, उपचार और अंतर्ज्ञान के लिए चंद्र ऊर्जा से जुड़ता है।' },
          { mantra: 'हूं (Hoom)', energy: 'सुरक्षा / नकारात्मकता का विनाश', usage: 'सुरक्षा और नकारात्मकता के बलपूर्वक विनाश के लिए एक शक्तिशाली मंत्र।' },
          { mantra: 'फट् (Phat)', energy: 'नकारात्मक शक्तियों को दूर करना', usage: 'नकारात्मक शक्तियों या बाधाओं को ऊर्जावान रूप से काटने और दूर करने के लिए उपयोग किया जाता है।' },
          { mantra: 'जं (Jam)', energy: 'मानसिक स्पष्टता', usage: 'मानसिक स्पष्टता, ज्ञान और बौद्धिक शक्ति को बढ़ाता है।' },
          { mantra: 'शं (Sham)', energy: 'शांति और स्थिरता', usage: 'शांति, स्थिरता और कल्याण का आह्वान करता है।' },
          { mantra: 'टं (Tam)', energy: 'चंद्र प्रभाव', usage: 'चंद्र प्रभाव, अंतर्ज्ञान और आंतरिक प्रतिबिंब से संबंधित है।' },
          { mantra: 'पं (Pam)', energy: 'ग्रह सद्भाव', usage: 'ग्रहों के प्रभावों और ऊर्जाओं में सामंजस्य स्थापित करने में मदद करता है।' },
      ]
  },
  'Malayalam': {
      aboutTitle: 'സൗന്ദര്യ ലഹരി എന്താണ്?',
      aboutText: '"സൗന്ദര്യ ലഹരി", "സൗന്ദര്യത്തിന്റെ തിരമാലകൾ" എന്ന് അർത്ഥം വരുന്ന, ദിവ്യ മാതാവായ പാർവതി ദേവിയുടെ അല്ലെങ്കിൽ ശക്തിയുടെ സൗന്ദര്യവും, കൃപയും, ശക്തിയും ആഘോഷിക്കുന്ന 100 ശ്ലോകങ്ങളുള്ള ഒരു ആദരണീയമായ പുരാതന ഗ്രന്ഥമാണ്. മഹാനായ തത്ത്വജ്ഞാനിയും സന്യാസിയുമായ ആദി ശങ്കരാചാര്യരാൽ രചിക്കപ്പെട്ടതായി കരുതപ്പെടുന്ന ഇത്, ശ്രീവിദ്യ പാരമ്പര്യത്തിന്റെ ഒരു മൂലക്കല്ലാണ്. ഈ ഗ്രന്ഥം രണ്ട് ഭാഗങ്ങളായി തിരിച്ചിരിക്കുന്നു: <strong>ആനന്ദ ലഹരി</strong> (ആദ്യത്തെ 41 ശ്ലോകങ്ങൾ), ശിവന്റെയും ശക്തിയുടെയും ആനന്ദകരമായ ഐക്യത്തിലും ശ്രീചക്ര ആരാധനയുടെ നിഗൂഢമായ വശങ്ങളിലും ശ്രദ്ധ കേന്ദ്രീകരിക്കുന്നു, കൂടാതെ <strong>സൗന്ദര്യ ലഹരി</strong> (ശേഷിക്കുന്ന 59 ശ്ലോകങ്ങൾ), ദേവിയുടെ ശാരീരികവും ദിവ്യവുമായ സൗന്ദര്യത്തെ തല മുതൽ കാൽ വരെ മനോഹരമായി വിവരിക്കുന്നു. ഓരോ ശ്ലോകവും ഒരു കവിത മാത്രമല്ല, ഭക്തിയോടെ ചൊല്ലുമ്പോൾ പ്രത്യേക ആത്മീയവും ഭൗതികവുമായ നേട്ടങ്ങൾ നൽകുമെന്ന് വിശ്വസിക്കപ്പെടുന്ന ഒരു ശക്തമായ മന്ത്രമാണ്. ഈ ആപ്ലിക്കേഷൻ ഈ ശ്ലോകങ്ങളിൽ അടങ്ങിയിരിക്കുന്ന അഗാധമായ ജ്ഞാനം അൺലോക്ക് ചെയ്യുന്നതിനുള്ള ഒരു വഴികാട്ടിയായി വർത്തിക്കുന്നു, നിങ്ങളുടെ പ്രത്യേക ഉദ്ദേശ്യങ്ങൾക്കായി ശരിയായ മന്ത്രം കണ്ടെത്താൻ സഹായിക്കുന്നു.',
      tableTitle: 'സൗന്ദര്യ ലഹരിയിലെ ബീജമന്ത്രങ്ങൾ',
      tableHeaders: { mantra: 'ബീജമന്ത്രം', energy: 'പ്രധാന ഊർജ്ജം', usage: 'ചുരുക്കിയ ഉപയോഗം' },
      bijaMantras: [
          { mantra: 'ॐ (Om)', energy: 'പ്രപഞ്ചത്തിന്റെ ആദിമ ശബ്ദം', usage: 'ഇന്ദ്രിയങ്ങളെ നിയന്ത്രിക്കുന്നതിനും ശാരീരിക ഊർജ്ജത്തിനും പ്രപഞ്ചവുമായി ബന്ധം സ്ഥാപിക്കുന്നതിനും.' },
          { mantra: 'ऐं (Aim)', energy: 'അറിവും സംസാരവും', usage: 'അറിവ്, വാക്ചാതുര്യം, കലാപരമായ കഴിവുകൾ എന്നിവ വർദ്ധിപ്പിക്കുന്നതിന്.' },
          { mantra: 'ह्रीं (Hreem)', energy: 'പ്രപഞ്ച ഊർജ്ജം', usage: 'സ്വാധീനം ചെലുത്തുന്നതിനും, മായയെ അകറ്റുന്നതിനും, ശുദ്ധീകരണത്തിനും, പ്രപഞ്ച ഊർജ്ജവുമായി ബന്ധപ്പെടുന്നതിനും.' },
          { mantra: 'क्लीं (Kleem)', energy: 'ആകർഷണത്തിന്റെ ഊർജ്ജം', usage: 'ഐശ്വര്യം, ആകർഷണം, ബന്ധങ്ങൾ ശക്തിപ്പെടുത്തൽ, ശത്രുക്കളെ കീഴടക്കൽ എന്നിവയ്ക്ക്.' },
          { mantra: 'श्रीं (Shreem)', energy: 'സമ്പത്തും ഐശ്വര്യവും', usage: 'സമ്പത്ത്, അറിവ്, വിദ്യാഭ്യാസ വിജയം, സമൃദ്ധി എന്നിവ നേടുന്നതിന്.' },
          { mantra: 'दुं (Dum)', energy: 'സംരക്ഷണം', usage: 'രോഗങ്ങളിൽ നിന്നും, ഭയത്തിൽ നിന്നും, ദാരിദ്ര്യത്തിൽ നിന്നും സംരക്ഷണം നേടുന്നതിന്.' },
          { mantra: 'सौः (Sauh)', energy: 'പരമോന്നത ബോധം', usage: 'ബുദ്ധി, വാക്ചാതുര്യം, ഉയർന്ന ആത്മീയ തലങ്ങൾ എന്നിവ കൈവരിക്കുന്നതിന്.' },
          { mantra: 'क्रों (KrOM)', energy: 'ശക്തമായ പ്രവൃത്തി', usage: 'പ്രകൃതി ശക്തികളിൽ ആധിപത്യം നേടാൻ ഉപയോഗിക്കുന്നു.' },
          { mantra: 'रं (Ram)', energy: 'അഗ്നി', usage: 'ബന്ധനങ്ങളിൽ നിന്നും കടങ്ങളിൽ നിന്നും മോചനം നേടുന്നതിനും ആഗ്രഹങ്ങൾ നിറവേറ്റുന്നതിനും.' },
          { mantra: 'यं (Yam)', energy: 'വായു', usage: 'പ്രകൃതി ഘടകങ്ങളെ നിയന്ത്രിക്കുന്നതിനും, ഐക്യം വളർത്തുന്നതിനും, ബന്ധങ്ങൾ മെച്ചപ്പെടുത്തുന്നതിനും.' },
          { mantra: 'वं (Vam)', energy: 'ജലം', usage: 'ശാസ്ത്രപരമായ അറിവും വിവിധ ഭാഷകളിൽ പ്രാവീണ്യവും നേടുന്നതിന്.' },
          { mantra: 'लं (Lam)', energy: 'ഭൂമി', usage: 'ഭൂമിയുമായി ബന്ധം സ്ഥാപിക്കുന്നതിനും, സ്ഥിരതയ്ക്കും, ഭൗതിക സുരക്ഷയ്ക്കും.' },
          { mantra: 'हं (Ham)', energy: 'ആകാശം', usage: 'പോഷണം, സമൃദ്ധി, ആകാശ തത്വവുമായി ബന്ധം സ്ഥാപിക്കുന്നതിന്.' },
          { mantra: 'सं (Sam)', energy: 'സർഗ്ഗാത്മകത', usage: 'കാവ്യാത്മക ഭാവനയും സർഗ്ഗാത്മക ബുദ്ധിയും വികസിപ്പിക്കുന്നതിന്.' },
          { mantra: 'कं (Kam)', energy: 'സന്തോഷവും രോഗശാന്തിയും', usage: 'സന്തോഷം, സംതൃപ്തി, രോഗശാന്തി എന്നിവ പ്രോത്സാഹിപ്പിക്കുന്നതിന്.' },
          { mantra: 'थं (Tham)', energy: 'നിഷേധം / നിശ്ചലമാക്കൽ', usage: 'നെഗറ്റീവ് ശക്തികളെയും, രോഗങ്ങളെയും, തടസ്സങ്ങളെയും നിർത്താനോ നിശ്ചലമാക്കാനോ ഉപയോഗിക്കുന്നു.' },
          { mantra: 'गं (Gam)', energy: 'ഗണപതി / തടസ്സങ്ങൾ നീക്കൽ', usage: 'തടസ്സങ്ങൾ നീക്കി വിജയത്തിലേക്ക് വഴി തുറക്കുന്നു.' },
          { mantra: 'ह्स्रौँ (Hsraum)', energy: 'ആത്മീയ പരിവർത്തനം', usage: 'ആത്മീയ പരിവർത്തനം, സംരക്ഷണം, ഉയർന്ന ബോധം എന്നിവയ്ക്ക്.' },
          { mantra: 'क्षं (Ksham)', energy: 'പൂർത്തീകരണവും ക്ഷമയും', usage: 'ക്ഷമ, സഹനം, ജോലികൾ പൂർത്തിയാക്കാനുള്ള കഴിവ് എന്നിവ പ്രോത്സാഹിപ്പിക്കുന്നു.' },
          { mantra: 'भं (Bham)', energy: 'തീവ്രമായ പരിവർത്തനം (ചൊവ്വ)', usage: 'ധൈര്യത്തിനും പ്രവർത്തനത്തിനും ഒരു തീവ്രമായ, പരിവർത്തനപരമായ ഊർജ്ജത്തെ ആവാഹിക്കുന്നു.' },
          { mantra: 'नं (Nam)', energy: 'മോചനവും വിരക്തിയും', usage: 'മോചനം, വിരക്തി, അഹംഭാവം എന്നിവ ഇല്ലാതാക്കാൻ സഹായിക്കുന്നു.' },
          { mantra: 'सूं (Soom)', energy: 'ചാന്ദ്ര ഊർജ്ജം', usage: 'പോഷണം, രോഗശാന്തി, അന്തർജ്ഞാനം എന്നിവയ്ക്കായി ചാന്ദ്ര ഊർജ്ജവുമായി ബന്ധപ്പെടുന്നു.' },
          { mantra: 'हूं (Hoom)', energy: 'സംരക്ഷണം / നെഗറ്റീവിറ്റി നശിപ്പിക്കൽ', usage: 'സംരക്ഷണത്തിനും നെഗറ്റീവിറ്റിയെ ശക്തമായി നശിപ്പിക്കുന്നതിനും ശക്തമായ മന്ത്രം.' },
          { mantra: 'फट् (Phat)', energy: 'നെഗറ്റീവ് ശക്തികളെ അകറ്റുന്നു', usage: 'നെഗറ്റീവ് ശക്തികളെയും തടസ്സങ്ങളെയും ഊർജ്ജസ്വലമായി മുറിച്ച് അകറ്റാൻ ഉപയോഗിക്കുന്നു.' },
          { mantra: 'जं (Jam)', energy: 'മാനസിക വ്യക്തത', usage: 'മാനസിക വ്യക്തത, ജ്ഞാനം, ബൗദ്ധിക ശക്തി എന്നിവ വർദ്ധിപ്പിക്കുന്നു.' },
          { mantra: 'शं (Sham)', energy: 'സമാധാനവും ശാന്തതയും', usage: 'സമാധാനം, ശാന്തത, ക്ഷേമം എന്നിവയെ ആവാഹിക്കുന്നു.' },
          { mantra: 'टं (Tam)', energy: 'ചാന്ദ്ര സ്വാധീനം', usage: 'ചാന്ദ്ര സ്വാധീനം, അന്തർജ്ഞാനം, ആന്തരിക പ്രതിഫലനം എന്നിവയുമായി ബന്ധപ്പെട്ടിരിക്കുന്നു.' },
          { mantra: 'पं (Pam)', energy: 'ഗ്രഹങ്ങളുടെ ഐക്യം', usage: 'ഗ്രഹങ്ങളുടെ സ്വാധീനങ്ങളെയും ഊർജ്ജങ്ങളെയും യോജിപ്പിക്കാൻ സഹായിക്കുന്നു.' },
      ]
  }
};

interface IntroModalProps {
    onClose: () => void;
}

const IntroModal: React.FC<IntroModalProps> = ({ onClose }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const currentContent = TRANSLATIONS[selectedLanguage as keyof typeof TRANSLATIONS];

  return (
    <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex justify-center items-center p-4 animate-fade-in"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
    >
      <div 
        className="bg-gradient-to-br from-amber-50/80 to-rose-100/80 backdrop-blur-lg rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col p-6 border border-white/30"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex justify-between items-center pb-4 border-b border-amber-200/50">
            <h2 id="intro-title" className="text-2xl font-bold text-amber-900 font-playfair">About Soundarya Lahari</h2>
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
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-2">
                  {currentContent.aboutTitle}
              </h3>
              <p className="text-left mb-4 leading-relaxed text-slate-700" dangerouslySetInnerHTML={{ __html: currentContent.aboutText }} />
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-amber-900 mb-4">
                  {currentContent.tableTitle}
              </h3>
              <div className="overflow-x-auto rounded-lg border border-amber-200/50 shadow-md">
                  <table className="w-full text-left border-collapse bg-white/40">
                  <thead className="bg-amber-100/80 backdrop-blur-sm">
                      <tr>
                        <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{currentContent.tableHeaders.mantra}</th>
                        <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{currentContent.tableHeaders.energy}</th>
                        <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">{currentContent.tableHeaders.usage}</th>
                      </tr>
                  </thead>
                  <tbody>
                      {currentContent.bijaMantras.map((item, index) => (
                      <tr key={index} className="hover:bg-amber-50/50 transition-colors">
                          <td className="p-3 border-b border-amber-100 font-bold text-amber-900" dangerouslySetInnerHTML={{ __html: item.mantra }} />
                          <td className="p-3 border-b border-amber-100 text-slate-700 align-top">{item.energy}</td>
                          <td className="p-3 border-b border-amber-100 text-slate-700 align-top">{item.usage}</td>
                      </tr>
                      ))}
                  </tbody>
                  </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default IntroModal;