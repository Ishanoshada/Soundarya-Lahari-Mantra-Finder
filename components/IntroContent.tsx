import React from 'react';

const bijaMantraData = [
  { mantra: 'क्लीं (Kleem)<br>ක්ලීම්', energy: 'ආකර්ෂණ ශක්තිය (Attraction)', usage: 'සමෘද්ධිය, ආකර්ෂණය, සබඳතා ශක්තිමත් කිරීම සහ සතුරන් ජය ගැනීම.' },
  { mantra: 'ह्रीं (Hreem)<br>හ්‍රීම්', energy: 'විශ්ව ශක්තිය (Universal Energy)', usage: 'බලපෑම් කිරීමේ හැකියාව, මායාව, පවිත්‍ර වීම සහ විශ්ව ශක්තිය හා සම්බන්ධ වීම.' },
  { mantra: 'श्रीं (Shreem)<br>ශ්‍රීම්', energy: 'ධනය සහ සෞභාග්‍යය (Wealth & Prosperity)', usage: 'ධනය, දැනුම, අධ්‍යාපන සාර්ථකත්වය සහ සශ්‍රීකත්වය ළඟා කර ගැනීම.' },
  { mantra: 'ऐं (Aim)<br>ඓම්', energy: 'දැනුම සහ කථනය (Knowledge & Speech)', usage: 'දැනුම, චතුර කථිකත්වය සහ කලාත්මක හැකියාවන් වර්ධනය කිරීම.' },
  { mantra: 'दुं (Dum)<br>දුම්', energy: 'ආරක්ෂාව (Protection)', usage: 'රෝග, බිය සහ දරිද්‍රතාවයෙන් ආරක්ෂා වීම.' },
  { mantra: 'सौः (Sauh)<br>සෞః', energy: 'උත්තරීතර විඥානය (Supreme Consciousness)', usage: 'බුද්ධිය, කථිකත්වය සහ ඉහළ අධ්‍යාත්මික තලයන් කරා ළඟා වීම.' },
  { mantra: 'ॐ (Om)<br>ඕම්', energy: 'විශ්වයේ මූලික ශබ්දය (Primordial Sound)', usage: 'ඉන්ද්‍රියන් පාලනය, ශාරීරික ශක්තිය සහ විශ්වය හා සම්බන්ධ වීම.' },
  { mantra: 'रं (Ram)<br>රම්', energy: 'ගිනි (Fire)', usage: 'බැඳීම් සහ ණයවලින් මිදීම, ආශාවන් ඉටුකර ගැනීම.' },
  { mantra: 'यं (Yam)<br>යම්', energy: 'වාතය (Air)', usage: 'ස්වභාවික මූලද්‍රව්‍ය පාලනය, සමගිය සහ සබඳතා යහපත් කර ගැනීම.' },
  { mantra: 'वं (Vam)<br>වම්', energy: 'ජලය (Water)', usage: 'ශාස්ත්‍රීය දැනුම සහ විවිධ භාෂා පිළිබඳ නිපුණත්වය ලබා ගැනීම.' },
  { mantra: 'सं (Sam)<br>සම්', energy: 'නිර්මාණශීලීත්වය (Creativity)', usage: 'කාව්‍යමය පරිකල්පනය සහ නිර්මාණශීලී බුද්ධිය වර්ධනය කිරීම.' },
  { mantra: 'क्रों (KrOM)<br>ක්‍රෝම්', energy: 'ශක්තිමත් ක්‍රියාව (Potent Action)', usage: 'ස්වභාවික බලවේග කෙරෙහි ආධිපත්‍යය ලබා ගැනීම සඳහා යොදා ගැනේ.' }
];


const IntroContent: React.FC = () => {
  return (
    <div className="text-amber-800 max-w-4xl mx-auto p-6 bg-white/50 rounded-xl shadow-sm animate-fade-in">
      <h3 className="text-2xl text-center font-bold text-amber-900 mb-4 font-playfair">
        What is Soundarya Lahari?
      </h3>
      <p className="text-left mb-8 leading-relaxed text-slate-700">
        Soundarya Lahari, meaning "Waves of Beauty," is a revered ancient text of 100 verses (slokas) celebrating the beauty, grace, and power of the Divine Mother, Goddess Parvati or Shakti. Attributed to the great philosopher and saint Adi Shankaracharya, it is a cornerstone of Shri Vidya tradition. The text is divided into two parts: the <strong>Ananda Lahari</strong> (first 41 verses), focusing on the blissful union of Shiva and Shakti and the esoteric aspects of Shri Chakra worship, and the <strong>Soundarya Lahari</strong> (remaining 59 verses), which exquisitely describes the physical and divine beauty of the Goddess from head to toe. Each verse is not just a poem but a powerful mantra, believed to grant specific spiritual and material benefits when recited with devotion. This application serves as a guide to unlock the profound wisdom within these verses, helping you find the right mantra for your specific intentions.
      </p>

      <h3 className="text-2xl text-center font-bold text-amber-900 mb-4 font-playfair">
        සෞන්දර්ය ලහරි ග්‍රන්ථයේ බීජ මන්ත්‍ර (Bija Mantras in Soundarya Lahari)
      </h3>
      <div className="overflow-x-auto rounded-lg border border-amber-200/50 shadow-md">
        <table className="w-full text-left border-collapse bg-white/40">
          <thead className="bg-amber-100/80 backdrop-blur-sm">
            <tr>
              <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">බීජ මන්ත්‍රය (Bija Mantra)</th>
              <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">ප්‍රධාන ශක්තිය (Primary Energy)</th>
              <th className="p-3 text-sm font-semibold tracking-wider text-amber-800 border-b-2 border-amber-200">සංක්ෂිප්ත භාවිතය (Brief Usage)</th>
            </tr>
          </thead>
          <tbody>
            {bijaMantraData.map((item, index) => (
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
  );
};

export default IntroContent;