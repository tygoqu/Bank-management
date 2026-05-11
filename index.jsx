import React, { useState, useEffect } from 'react';
import { User, Briefcase, Landmark, Smartphone, Globe, Sun, Zap, CheckCircle, AlertCircle, ArrowRight, GraduationCap, Building, ShieldAlert, Cpu, Leaf } from 'lucide-react';

export default function BankGame() {
  const [gameState, setGameState] = useState('start'); // start, playing, end
  const [scene, setScene] = useState(1);
  const [dialogueIndex, setDialogueIndex] = useState(0);
  
  const [score, setScore] = useState(0);
  const [money, setMoney] = useState(100); // Эхний хөрөнгө 100 сая
  
  // ШИНЭ: Стратеги болон Олон улсын чиг хандлага
  const [bankStrategy, setBankStrategy] = useState(null); // 'digital' эсвэл 'traditional'
  const [globalTrend, setGlobalTrend] = useState(null); // 'AI_TECH' эсвэл 'ESG_GREEN'
  
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsSorted, setCardsSorted] = useState(0);

  const [crisisCards, setCrisisCards] = useState([
    { id: 1, name: "Орон нутгийн ЖДБ", type: "Ган гачиг (Түр)", amount: 200, status: 'pending' },
    { id: 2, name: "Импортлогч компани", type: "Зориулалтын бус зарцуулалт", amount: 150, status: 'pending' }
  ]);
  const [crisisResolved, setCrisisResolved] = useState(0);

  const [walkers, setWalkers] = useState([]);
  const [bankNPCs, setBankNPCs] = useState({ tellers: [], active: [], waiting: [] });

  const generateRandomSeed = () => Math.random().toString(36).substring(2, 10);

  useEffect(() => {
    setBankNPCs({
      tellers: [generateRandomSeed(), generateRandomSeed(), generateRandomSeed()],
      active: [generateRandomSeed(), generateRandomSeed()],
      waiting: [generateRandomSeed(), generateRandomSeed(), generateRandomSeed()]
    });
  }, []);

  useEffect(() => {
    if (gameState !== 'playing') return;
    const spawnWalker = () => {
      const randomSeed = generateRandomSeed();
      const randomBottom = Math.floor(Math.random() * 15);
      const newWalker = {
        id: Date.now() + Math.random(),
        seed: randomSeed,
        duration: 12 + Math.random() * 10,
        bottom: `${randomBottom}%`,
        direction: Math.random() > 0.5 ? 'right' : 'left'
      };
      setWalkers(prev => [...prev, newWalker]);
      setTimeout(() => {
        setWalkers(prev => prev.filter(w => w.id !== newWalker.id));
      }, newWalker.duration * 1000);
    };
    const interval = setInterval(spawnWalker, 4000);
    spawnWalker();
    return () => clearInterval(interval);
  }, [gameState]);

  const characters = {
    'Болд захирал': { 
      image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=BoldManager2', 
      color: 'bg-blue-100', borderColor: 'border-blue-500' 
    },
    'Оюутан': { 
      image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=StudentBoy', 
      color: 'bg-green-100', borderColor: 'border-green-500' 
    },
    'Гадаадын Өрсөлдөгч': { 
      image: 'https://api.dicebear.com/8.x/pixel-art/svg?seed=GlobalBanker', 
      color: 'bg-indigo-100', borderColor: 'border-indigo-500' 
    },
    'Систем/Мэдээ': { 
      icon: <Globe size={48} className="text-blue-600 animate-pulse" />, 
      color: 'bg-blue-50', borderColor: 'border-blue-300' 
    }
  };

  // Үйл явдлыг динамикаар үүсгэх
  const getStoryData = () => ({
    1: [
      { speaker: 'Болд захирал', text: 'Төрийн банкинд тавтай морил! Бид бол Монгол улсын өнцөг булан бүрт хүрч ажилладаг, хамгийн олон харилцагчтай уламжлалт банк.' },
      { speaker: 'Систем/Мэдээ', text: 'МЭДЭЭ: "Global Tech Bank" хэмээх гадаадын бүрэн цахим банк Монголын зах зээлд орж ирлээ. Тэд хиймэл оюун ухаан ашиглаж, залуусыг татаж эхлэв.' },
      { speaker: 'Болд захирал', text: 'Өрсөлдөгч маань маш хүчтэй байна. Гэхдээ бид эхлээд өөрсдийн үндсэн үүргээ биелүүлэх ёстой. Эхний харилцагчдаа үйлчилцгээе.' },
      { speaker: 'Оюутан', text: 'Сайн байна уу? Би хөдөө орон нутгаас ирсэн оюутан байна. Надад сургалтын төлбөрөө төлөхөд бага зэрэг тусламж хэрэгтэй байна.' },
      { 
        type: 'choice', 
        speaker: 'Тоглогч', 
        text: 'Оюутанд юу санал болгох вэ?',
        choices: [
          { text: 'Боловсролын зээл (Бага хүүтэй, урт хугацаатай)', correct: true, feedback: 'Зөв! Төрийн банк нийгмийн хариуцлагын хүрээнд оюутнуудыг дэмжих нь чухал.', reward: 50 },
          { text: 'Өндөр хүүтэй хэрэглээний зээл', correct: false, feedback: 'Буруу. Оюутанд өндөр хүү дарамт болно. Бид харилцагчаа алдлаа.', reward: 0 }
        ]
      },
      { speaker: 'Болд захирал', text: 'Сайн байна! Одоо бид банкныхаа ирээдүйн чиг хандлагыг тодорхойлох маш чухал шийдвэр гаргах шаардлагатай боллоо.' }
    ],
    2: [
      { speaker: 'Болд захирал', text: 'Гадаадын "Global Tech Bank" гар утасны апп болон AI ашиглан бидний зах зээлээс хумсалж байна. Бидэнд хязгаарлагдмал хөрөнгө бий. Бид ямар стратеги баримтлах вэ?' },
      { speaker: 'Систем/Мэдээ', text: 'СТРАТЕГИ СОНГОХ: Та банкны ирээдүйн замыг тодорхойлно уу.' },
      { 
        type: 'choice', 
        speaker: 'Тоглогч', 
        text: 'Төрийн банкны хөгжлийн стратеги:',
        choices: [
          { text: 'Дижитал Шилжилт: Бүх хөрөнгөө интернэт банк, AI хөгжүүлэлтэд зориулах (Өрсөлдөгчтэй технологиор өрсөлдөнө)', correct: true, action: 'digital', feedback: 'Та дижитал шилжилтийг сонголоо. Технологи хөгжүүлэхэд цаг хугацаа орох ч залуу үеийг татах болно.', reward: -50 },
          { text: 'Уламжлалт ба Хүртээмж: Орон нутгийн салбаруудаа сайжруулж, харилцагчтайгаа биечлэн тулж ажиллах (Давуу талаа баталгаажуулна)', correct: true, action: 'traditional', feedback: 'Та уламжлалт харилцааг сонголоо. Дижитал болохгүй ч, хөдөө орон нутаг болон ахмад настнуудын бүрэн итгэлийг олно.', reward: -50 }
        ]
      },
      { speaker: 'Болд захирал', text: bankStrategy === 'digital' ? 'Эрсдэлтэй боловч зоригтой шийдвэр байна. Бид системийн шинэчлэлээ эхлүүллээ!' : 'Бидний уугуул давуу тал бол хүн хоорондын харилцаа. Хүртээмжээрээ тэднийг ялах болно!' }
    ],
    3: [
      { speaker: 'Гадаадын Өрсөлдөгч', text: 'Хаха, Төрийн банк та нар бидэнтэй өрсөлдөнө гэж үү? Бид секундэд 10,000 гүйлгээ хийж байхад та нар цаастай зуралдсаар л байна.' },
      { speaker: 'Болд захирал', text: 'Битгий бардам бай. Банк бүрд өөрийн гэсэн үнэ цэнэ бий. Яг одоо бид хоёр банкны үйлчилгээний онцлогийг ялгаж харуулцгаая.' },
      { type: 'sorting_game' },
      { speaker: 'Болд захирал', text: 'Харж байна уу? Технологи бүх зүйлийг шийдэхгүй. Гэхдээ зах зээл дээр бид хоёулаа оршин тогтнох шаардлагатай.' }
    ],
    4: [
      { speaker: 'Систем/Мэдээ', text: 'АНХААР: Улс орны эдийн засагт савлагаа үүсэж, чанаргүй зээл (NPL) огцом өслөө. Зээлийн эрсдэлээ удирдах цаг ирлээ.' },
      { type: 'crisis_game' },
      { speaker: 'Болд захирал', text: 'Эрсдэлийг амжилттай давлаа. Харин одоо дэлхий нийтэд гарч буй цоо шинэ чиг хандлага манай зах зээлд хүчтэй орж ирж байна.' }
    ],
    5: [
      { speaker: 'Систем/Мэдээ', text: `ОЛОН УЛСЫН ЧИГ ХАНДЛАГА: ${globalTrend === 'AI_TECH' ? '"Хиймэл оюун ухаан (AI) болон Автоматжуулалт" дэлхийн санхүүг бүрэн эзэгнэж эхэллээ. Хүнээс хамааралгүй хурд хамгийн чухал болов.' : '"ESG буюу Ногоон санхүүжилт, нийгмийн нөлөөлөл" хамгийн чухал тренд боллоо. Байгаль болон нийгэмд ээлтэй банкууд л амьд үлдэх нь.'}` },
      { speaker: 'Болд захирал', text: 'Энэ чиг хандлага бидний өмнө гаргасан стратегитай хэр нийцэж байгааг харцгаая.' },
      { 
        type: 'evaluation', 
        speaker: 'Систем/Мэдээ', 
        text: 'Үр дүнгээ харахын тулд дарна уу...' 
      }
    ]
  });

  const sortingCards = [
    { text: 'Ахмад настны тэтгэвэр, халамж олголт', target: 'state' },
    { text: 'Крипто болон гадаад хувьцааны арилжаа', target: 'foreign' },
    { text: 'Алслагдсан малчдад зориулсан явуулын банк', target: 'state' },
    { text: 'AI-д суурилсан 1 минутын автомат зээл', target: 'foreign' }
  ];

  const startGame = () => {
    // 2026 оны гол 2 чиг хандлагын нэгийг санамсаргүйгээр сугалах
    const trend = Math.random() > 0.5 ? 'AI_TECH' : 'ESG_GREEN';
    setGlobalTrend(trend);
    setBankStrategy(null);
    setGameState('playing');
    setScene(1);
    setDialogueIndex(0);
    setScore(0);
    setMoney(100);
    setCrisisResolved(0);
    
    // Хямралын картуудыг дахин шинэчлэх
    setCrisisCards(prev => prev.map(c => ({...c, status: 'pending'})));
  };

  const nextDialogue = () => {
    const currentSceneData = getStoryData()[scene];
    if (dialogueIndex < currentSceneData.length - 1) {
      setDialogueIndex(dialogueIndex + 1);
    } else {
      if (scene < 5) {
        setScene(scene + 1);
        setDialogueIndex(0);
      } else {
        setGameState('end');
      }
    }
  };

  const handleChoice = (choice) => {
    if (choice.action) {
      setBankStrategy(choice.action);
    }
    
    // Alert-ийн оронд UI дээр харуулбал илүү гоё ч, энгийн байдлаар alert үлдээе
    alert(choice.feedback);
    
    if (choice.correct) {
      setScore(score + 15);
    }
    setMoney(money + choice.reward);
    nextDialogue();
  };

  const handleSort = (selection) => {
    const currentCard = sortingCards[currentCardIndex];
    if (currentCard.target === selection) {
      setScore(score + 20);
      alert('Зөв байна!');
    } else {
      alert('Буруу байна.');
    }
    
    if (currentCardIndex < sortingCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCardsSorted(true);
      nextDialogue();
    }
  };

  const handleCrisisChoice = (id, action) => {
    const card = crisisCards.find(c => c.id === id);
    if (card.type === 'Ган гачиг (Түр)' && action === 'extend') {
      alert('Зөв! Байгалийн давагдашгүй хүчин зүйлд орсон ЖДБ-ийн хугацааг сунгах нь Төрийн банкны зөв бодлого.');
      setScore(score + 20);
    } else if (card.type === 'Зориулалтын бус зарцуулалт' && action === 'court') {
      alert('Зөв! Зээлээ өөр зүйлд зарцуулж луйвар хийсэн тул хуулийн дагуу хандах нь зүйтэй.');
      setScore(score + 20);
      setMoney(money + card.amount);
    } else {
      alert('Буруу шийдвэр гаргалаа! Банк хөрөнгөө алдлаа.');
      setScore(score - 10);
      setMoney(Math.max(0, money - card.amount));
    }

    const newCards = crisisCards.map(c => c.id === id ? { ...c, status: 'resolved' } : c);
    setCrisisCards(newCards);
    
    if (crisisResolved + 1 >= crisisCards.length) {
      nextDialogue();
    } else {
      setCrisisResolved(crisisResolved + 1);
    }
  };

  const evaluateEnding = () => {
    let resultText = "";
    if (globalTrend === 'AI_TECH' && bankStrategy === 'digital') {
      resultText = "ГАЙХАЛТАЙ АМЖИЛТ! Таны дижитал болох шийдвэр яг цагаа оллоо. Хиймэл оюун ухааны тренд хүчтэй орж ирэх үед танай банк аль хэдийн бэлтгэлтэй байж, Гадаадын банктай эн тэнцүү өрсөлдөн зах зээлээ хамгаалж чадлаа.";
      setScore(score + 100);
    } else if (globalTrend === 'AI_TECH' && bankStrategy === 'traditional') {
      resultText = "ХҮНДРЭЛ! Дэлхий нийт AI-руу хошуурч байхад танай банк цахимжиж амжаагүйгээс болж залуу харилцагчдаа Гадаадын банкинд бүрэн алдлаа. Хэдийгээр хөдөө орон нутагт тогтвортой байгаа ч, банкны ашиг огцом буурав.";
      setScore(score - 20);
    } else if (globalTrend === 'ESG_GREEN' && bankStrategy === 'traditional') {
      resultText = "ГАЙХАЛТАЙ АМЖИЛТ! Дэлхий нийт технологиос илүү Нийгмийн хариуцлага, Хүртээмж (ESG)-ийг чухалчилж эхэллээ! Таны уламжлалт, ард түмэнтэйгээ ойр байх стратеги төгс нийцэж, Гадаадын банкны хүйтэн алгоритмаас илүү үнэлэгдлээ.";
      setScore(score + 100);
    } else if (globalTrend === 'ESG_GREEN' && bankStrategy === 'digital') {
      resultText = "ДУНДЖАН АМЖИЛТ. Танай банк технологийн хувьд хүчирхэг болсон ч, нийгэм, орон нутгийн харилцааг орхигдуулсан байв. Гэхдээ та дижитал системээ ашиглан Ногоон зээлийг хурдан олгож бага зэрэг амжилт үзүүллээ.";
      setScore(score + 30);
    }
    
    alert(resultText);
    setGameState('end');
  };

  // --- Дэлгэцүүдийн рендер ---
  if (gameState === 'start') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen text-white relative overflow-hidden" style={{ backgroundColor: '#0f172a', fontFamily: "'Press Start 2P', monospace, sans-serif" }}>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
          @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
          .animate-blink { animation: blink 1.5s infinite; }
          .pixel-grid { background-image: linear-gradient(#334155 2px, transparent 2px), linear-gradient(90deg, #334155 2px, transparent 2px); background-size: 40px 40px; }
          .pixel-shadow { box-shadow: 6px 6px 0px rgba(0,0,0,0.5); }
          .pixel-text-shadow { text-shadow: 4px 4px 0px rgba(0,0,0,1); }
        `}} />
        <div className="absolute inset-0 pixel-grid opacity-30"></div>
        <div className="z-10 flex flex-col items-center">
          <div className="flex gap-6 mb-8">
            <Landmark size={80} className="text-red-500 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" />
            <h1 className="text-4xl md:text-6xl text-center text-yellow-300 pixel-text-shadow leading-relaxed tracking-widest pt-4">
              VS
            </h1>
            <Globe size={80} className="text-indigo-400 drop-shadow-[4px_4px_0_rgba(0,0,0,1)]" />
          </div>
          
          <h1 className="text-3xl md:text-5xl mb-4 text-center text-white pixel-text-shadow leading-relaxed tracking-widest">
            ТӨРИЙН БАНК
          </h1>
          <h2 className="text-xl md:text-2xl mb-8 text-center text-gray-400 pixel-text-shadow">
            ГАДААДЫН БАНКНЫ ЭСРЭГ
          </h2>
          
          <div className="mb-12 text-xs md:text-sm text-gray-300 text-center max-w-xl leading-8 bg-slate-800 p-6 rounded-xl border-4 border-black pixel-shadow" style={{ fontFamily: "sans-serif" }}>
            <p className="font-bold text-lg mb-2 text-white" style={{ fontFamily: "'Press Start 2P'" }}>ТОГЛООМЫН ДҮРЭМ</p>
            Та Төрийн банкны стратегич. Орчин үеийн дижитал банк болох уу? Эсвэл уламжлалт үнэт зүйлээ хадгалах уу? Олон улсын хувьсах чиг хандлага таныг шалгах болно.
          </div>
          
          <button 
            onClick={startGame}
            className="px-8 py-5 bg-green-500 text-black border-4 border-black font-bold text-lg hover:bg-green-400 transition-transform active:translate-y-2 active:shadow-none pixel-shadow animate-blink"
          >
            INSERT COIN TO PLAY
          </button>
        </div>
      </div>
    );
  }

  if (gameState === 'end') {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen bg-slate-900 text-white p-4">
        {score > 100 ? (
          <CheckCircle size={80} className="text-green-400 mb-6" />
        ) : (
          <AlertCircle size={80} className="text-yellow-400 mb-6" />
        )}
        <h1 className="text-4xl font-bold mb-4 text-center">Тоглоом өндөрлөлөө</h1>
        <div className="bg-slate-800 p-6 rounded-xl text-center mb-8 max-w-md w-full border border-slate-700">
          <p className="text-2xl mb-2 text-blue-300">Таны эцсийн оноо: <strong>{score}</strong></p>
          <p className="text-lg text-gray-400 mt-4">Таны сонгосон стратеги: <strong className="text-white">{bankStrategy === 'digital' ? 'Дижитал Шилжилт' : 'Уламжлалт ба Хүртээмж'}</strong></p>
          <p className="text-lg text-gray-400 mt-2">Дэлхийн чиг хандлага: <strong className="text-white">{globalTrend === 'AI_TECH' ? 'Хиймэл оюун ухаан (AI)' : 'Ногоон Санхүүжилт (ESG)'}</strong></p>
        </div>
        <p className="text-lg mb-8 text-gray-300 text-center max-w-2xl">
          Банкны үйл ажиллагаа нь дэлхий дахины чиг хандлагатай хэрхэн уялдах ёстойг та мэдэрсэн гэж найдаж байна. Дахин тоглож өөр тренд дээр өөр стратеги хэрэглэж үзээрэй!
        </p>
        <button 
          onClick={startGame}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-full font-bold text-lg transition-all border-2 border-white"
        >
          Дахин тоглох
        </button>
      </div>
    );
  }

  const currentSceneData = getStoryData()[scene];
  const currentLine = currentSceneData[dialogueIndex];
  
  const getBgClass = () => {
    // Стратегиэс хамаарч банкны өнгө төрхийг өөрчлөх
    if (scene > 2 && bankStrategy === 'digital') return 'bg-slate-800'; // Дижитал болсон бол арай неон/бараан
    return 'bg-slate-100'; // Уламжлалт цайвар
  };

  return (
    <div className={`flex flex-col w-full h-screen ${getBgClass()} transition-colors duration-1000 font-sans relative overflow-hidden`}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes walk-right { 0% { transform: translateX(-100px) translateY(0) rotate(-5deg); } 25% { transform: translateX(25vw) translateY(-5px) rotate(5deg); } 50% { transform: translateX(50vw) translateY(0) rotate(-5deg); } 75% { transform: translateX(75vw) translateY(-5px) rotate(5deg); } 100% { transform: translateX(110vw) translateY(0) rotate(-5deg); } }
        @keyframes walk-left { 0% { transform: translateX(110vw) translateY(0) rotate(5deg) scaleX(-1); } 25% { transform: translateX(75vw) translateY(-5px) rotate(-5deg) scaleX(-1); } 50% { transform: translateX(50vw) translateY(0) rotate(5deg) scaleX(-1); } 75% { transform: translateX(25vw) translateY(-5px) rotate(-5deg) scaleX(-1); } 100% { transform: translateX(-100px) translateY(0) rotate(5deg) scaleX(-1); } }
        .walking-npc-right { animation: walk-right linear forwards; }
        .walking-npc-left { animation: walk-left linear forwards; }
        .pixelated-render { image-rendering: pixelated; }
      `}} />

      {/* Дээд самбар */}
      <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md z-50 border-b-4 border-slate-700 relative">
        <div className="font-bold text-lg">Үзэгдэл {scene} / 5</div>
        <div className="flex gap-4 md:gap-6 text-sm md:text-base">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 hidden md:inline">Тренд:</span>
            {globalTrend === 'AI_TECH' ? <Cpu className="text-blue-400" size={18}/> : <Leaf className="text-green-400" size={18}/>}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Оноо:</span>
            <span className="font-bold text-blue-400">{score}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 hidden md:inline">Хөрөнгө:</span>
            <span className="font-bold text-green-400">₮{money} сая</span>
          </div>
        </div>
      </div>

      {/* Банкны Интерьер */}
      {gameState === 'playing' && (
        <div className="absolute inset-0 pointer-events-none z-0 flex flex-col opacity-60">
          <div className={`h-[55%] relative border-b-4 ${bankStrategy === 'digital' ? 'bg-slate-700 border-slate-900' : 'bg-amber-50 border-slate-300'} transition-colors duration-1000`}>
            {/* Банкны лого/Цаг */}
            <div className={`absolute top-10 right-16 w-20 h-20 rounded-full border-8 flex items-center justify-center shadow-md transition-colors ${bankStrategy === 'digital' ? 'bg-slate-900 border-blue-500' : 'bg-white border-slate-800'}`}>
              <div className={`w-1 h-8 origin-bottom transform rotate-45 mb-4 ${bankStrategy === 'digital' ? 'bg-blue-400' : 'bg-slate-800'}`}></div>
            </div>
            {/* Цонх */}
            <div className={`absolute top-12 left-12 w-40 h-32 border-8 opacity-80 grid grid-cols-2 gap-1 p-1 ${bankStrategy === 'digital' ? 'bg-slate-900 border-slate-600' : 'bg-blue-100 border-slate-400'}`}>
              <div className={`${bankStrategy === 'digital' ? 'bg-indigo-900/50' : 'bg-blue-200/50'}`}></div><div className={`${bankStrategy === 'digital' ? 'bg-indigo-900/50' : 'bg-blue-200/50'}`}></div>
              <div className={`${bankStrategy === 'digital' ? 'bg-indigo-900/50' : 'bg-blue-200/50'}`}></div><div className={`${bankStrategy === 'digital' ? 'bg-indigo-900/50' : 'bg-blue-200/50'}`}></div>
            </div>
          </div>

          <div className="h-[45%] bg-slate-200 relative" style={{ backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05)), repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 25%, rgba(0,0,0,0.1) 25%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.05) 75%, rgba(0,0,0,0.05))', backgroundPosition: '0 0, 20px 20px', backgroundSize: '40px 40px' }}>
            
            {/* Лангууны хэсэг */}
            <div className="absolute top-[-30px] left-[5%] w-[45%] h-full z-10">
              <div className="absolute top-[-40px] left-[10%] w-20 h-20 z-10 flex flex-col items-center">
                <img src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${bankNPCs.tellers[0]}&clothing=blazerAndShirt`} className="w-full h-full pixelated-render" alt="Teller" />
                {bankStrategy === 'digital' ? 
                  <div className="w-12 h-8 bg-blue-900 mt-[-10px] rounded border-2 border-blue-400 z-20 animate-pulse"></div> : 
                  <div className="w-10 h-6 bg-slate-800 mt-[-10px] rounded border border-slate-600 z-20"></div>
                }
              </div>
              <div className="absolute top-[-40px] left-[70%] w-20 h-20 z-10 flex flex-col items-center">
                <img src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${bankNPCs.tellers[2]}&clothing=blazerAndShirt`} className="w-full h-full pixelated-render" alt="Teller" />
                {bankStrategy === 'digital' ? 
                  <div className="w-12 h-8 bg-blue-900 mt-[-10px] rounded border-2 border-blue-400 z-20 animate-pulse"></div> : 
                  <div className="w-10 h-6 bg-slate-800 mt-[-10px] rounded border border-slate-600 z-20"></div>
                }
              </div>

              {/* Лангууны мод эсвэл Металл */}
              <div className={`absolute top-[25px] w-full h-24 border-t-8 rounded-t-xl shadow-xl z-20 transition-colors ${bankStrategy === 'digital' ? 'bg-slate-800 border-blue-500' : 'bg-amber-800 border-amber-900'}`}></div>
              <div className={`absolute top-0 w-full h-12 border-2 z-20 transition-colors ${bankStrategy === 'digital' ? 'bg-blue-500/20 border-blue-400/50' : 'bg-blue-300/30 border-slate-300/50'}`}></div>

              {/* Үйлчлүүлэгч */}
              <div className="absolute top-[10px] left-[10%] w-24 h-24 z-30 opacity-90">
                <img src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${bankNPCs.active[0]}`} className="w-full h-full pixelated-render drop-shadow-md" alt="Active Customer" />
              </div>
            </div>

            {walkers.map(walker => (
              <div key={walker.id} className={`absolute ${walker.direction === 'right' ? 'walking-npc-right' : 'walking-npc-left'} flex flex-col items-center z-40`} style={{ animationDuration: `${walker.duration}s`, bottom: walker.bottom, left: walker.direction === 'right' ? '-100px' : 'auto', right: walker.direction === 'left' ? '-100px' : 'auto' }}>
                <img src={`https://api.dicebear.com/8.x/pixel-art/svg?seed=${walker.seed}`} alt="Walking NPC" className="w-20 h-20 drop-shadow-xl pixelated-render" />
                <div className="w-12 h-2 bg-black/40 rounded-[50%] mt-[-5px] blur-[2px]"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Гол тоглоомын талбар (Мини-тоглоомууд) */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-4 overflow-hidden z-20">
        
        {/* 2. Ангилах тоглоом (Төрийн банк VS Гадаадын банк) */}
        {currentLine.type === 'sorting_game' && (
          <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-xl z-20 border-4 border-slate-200">
            <h2 className="text-2xl font-bold mb-2 text-center text-slate-800">Өрсөлдөөний шинжилгээ</h2>
            <p className="text-center text-slate-600 mb-8">Энэ үйлчилгээ/онцлог нь аль банкинд хамаарах вэ?</p>
            
            <div className="bg-blue-50 border-4 border-blue-200 p-8 rounded-xl text-center mb-8 min-h-[150px] flex items-center justify-center shadow-inner">
              <p className="text-2xl font-semibold text-blue-900">{sortingCards[currentCardIndex].text}</p>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button onClick={() => handleSort('state')} className="flex-1 py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg shadow-[4px_4px_0_rgba(0,0,0,0.2)] transition-all flex flex-col items-center gap-2 active:translate-y-1 active:shadow-none">
                <Landmark size={32} /> Төрийн Банк (Монгол)
              </button>
              <button onClick={() => handleSort('foreign')} className="flex-1 py-4 bg-indigo-800 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg shadow-[4px_4px_0_rgba(0,0,0,0.2)] transition-all flex flex-col items-center gap-2 active:translate-y-1 active:shadow-none">
                <Globe size={32} /> Global Tech Bank
              </button>
            </div>
            <div className="text-center mt-4 font-bold text-slate-400">
              Карт: {currentCardIndex + 1} / {sortingCards.length}
            </div>
          </div>
        )}

        {/* 3. Хямралын менежмент */}
        {currentLine.type === 'crisis_game' && (
          <div className="w-full max-w-4xl bg-white p-8 rounded-2xl shadow-2xl z-50 border-4 border-red-500 animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-red-50 opacity-20 pointer-events-none"></div>
            <div className="flex items-center justify-center gap-4 mb-6 text-red-600 relative z-10">
              <ShieldAlert size={40} className="animate-pulse" />
              <h2 className="text-3xl font-bold text-slate-800">Чанаргүй Зээлийн Эрсдэл</h2>
            </div>
            <p className="text-center text-slate-600 mb-8 font-medium relative z-10">Төрийн банкны хувьд эрсдэлийг удирдах нь хамгийн чухал.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {crisisCards.map(card => (
                <div key={card.id} className={`border-4 p-6 rounded-xl flex flex-col transition-all ${card.status === 'resolved' ? 'border-green-400 bg-green-50 opacity-60' : 'border-red-300 bg-white shadow-lg'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-slate-800">{card.name}</h3>
                      <span className="text-xs font-bold px-2 py-1 bg-red-100 rounded text-red-700 border border-red-200 mt-2 inline-block uppercase tracking-wider">Шалтгаан: {card.type}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 text-xs uppercase font-bold">Үлдэгдэл</span>
                      <p className="font-black text-2xl text-red-600">₮{card.amount} сая</p>
                    </div>
                  </div>
                  {card.status === 'pending' ? (
                    <div className="flex gap-3 mt-auto pt-4 border-t-2 border-slate-100">
                      <button onClick={() => handleCrisisChoice(card.id, 'extend')} className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 text-black border-2 border-yellow-700 rounded-lg font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none transition-all">
                        Хугацаа сунгах
                      </button>
                      <button onClick={() => handleCrisisChoice(card.id, 'court')} className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white border-2 border-red-800 rounded-lg font-bold text-sm shadow-[2px_2px_0_rgba(0,0,0,0.3)] active:translate-y-1 active:shadow-none transition-all">
                        Шүүхэд хандах
                      </button>
                    </div>
                  ) : (
                    <div className="mt-auto pt-4 text-center font-bold text-green-600 text-lg flex items-center justify-center gap-2">
                      <CheckCircle size={24} /> Шийдвэрлэгдсэн
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Төгсгөлийн үнэлгээний товч */}
        {currentLine.type === 'evaluation' && (
          <button 
            onClick={evaluateEnding}
            className="px-10 py-5 bg-yellow-400 text-black border-4 border-black text-2xl font-bold shadow-[8px_8px_0_rgba(0,0,0,0.5)] hover:bg-yellow-300 hover:translate-y-1 hover:shadow-[4px_4px_0_rgba(0,0,0,0.5)] transition-all z-50 animate-bounce"
            style={{ fontFamily: "'Press Start 2P', sans-serif" }}
          >
            ҮР ДҮНГ ХАРАХ
          </button>
        )}

      </div>

      {/* Доод талын харилцан ярианы хэсэг */}
      {(!currentLine.type || currentLine.type === 'choice') && (
        <div className="w-full p-4 md:p-8 bg-gradient-to-t from-slate-900/90 to-transparent flex justify-center z-50 relative">
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-4 md:gap-6">
            
            {currentLine.speaker && characters[currentLine.speaker] && (
              <div className={`w-20 h-20 md:w-32 md:h-32 rounded-2xl flex-shrink-0 flex items-end justify-center border-4 shadow-[4px_4px_0_rgba(0,0,0,0.3)] overflow-hidden ${characters[currentLine.speaker].color} ${characters[currentLine.speaker].borderColor} self-center md:self-auto`}>
                {characters[currentLine.speaker].image ? (
                  <img src={characters[currentLine.speaker].image} alt={currentLine.speaker} className="w-[120%] h-[120%] object-cover mt-2 pixelated-render" style={{ imageRendering: 'pixelated' }} />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    {characters[currentLine.speaker].icon}
                  </div>
                )}
              </div>
            )}
            
            <div className="flex-1 bg-white rounded-2xl shadow-[8px_8px_0_rgba(0,0,0,0.2)] p-4 md:p-6 border-4 border-slate-300 flex flex-col justify-between min-h-[160px]">
              {currentLine.type !== 'choice' ? (
                <>
                  <div>
                    <h3 className="font-bold text-blue-800 text-lg md:text-xl mb-2">{currentLine.speaker}</h3>
                    <p className="text-slate-700 text-base md:text-xl leading-relaxed font-medium">{currentLine.text}</p>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button onClick={nextDialogue} className="px-4 md:px-6 py-2 bg-slate-800 text-white border-2 border-black rounded-xl hover:bg-slate-700 transition-colors flex items-center gap-2 font-bold shadow-[2px_2px_0_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none">
                      Цааш нь <ArrowRight size={18} />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <h3 className="font-bold text-blue-800 text-lg md:text-xl mb-4">{currentLine.text}</h3>
                    <div className="grid gap-2 md:gap-3">
                      {currentLine.choices.map((choice, idx) => (
                        <button key={idx} onClick={() => handleChoice(choice)} className="text-left w-full p-3 md:p-4 rounded-xl border-4 border-slate-200 hover:border-blue-500 hover:bg-blue-50 transition-all font-bold text-sm md:text-base text-slate-700 hover:shadow-md">
                          {choice.text}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
