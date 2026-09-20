// Knowledge-check questions. a = index of the correct option.
export const QUIZ = [
  {
    a: 1,
    zh: { q: '為什麼單片式清洗機的旋轉夾盤幾乎都採用「機械式邊緣夾持」而不是真空吸盤？',
      o: ['因為真空吸盤成本較高', '因為濕氣會破壞真空，且背面吸附會留痕並妨礙背面清洗', '因為機械夾持轉速可以更低', '因為真空吸盤不耐高溫'],
      e: '濕製程環境中水氣會讓真空失效；而且吸附整個背面會留下接觸痕跡，也讓背面清洗無法進行。邊緣夾持只接觸晶圓邊緣約 0.5–1 mm，並利用離心力自鎖，轉速愈高夾持力愈大。' },
    en: { q: 'Why do single-wafer cleaners almost always use mechanical edge grip instead of a vacuum chuck?',
      o: ['Vacuum chucks cost more', 'Moisture defeats vacuum, and backside suction marks the wafer and blocks backside cleaning', 'Mechanical grip allows lower RPM', 'Vacuum chucks cannot take high temperature'],
      e: 'In a wet environment moisture breaks the vacuum; holding the whole backside also leaves contact marks and makes backside cleaning impossible. Edge grip touches only ~0.5–1 mm of the edge and self-energizes with centrifugal force, so grip strength rises with speed.' },
    ja: { q: '枚葉洗浄装置のスピンチャックが真空チャックではなく機械式エッジグリップを使う主な理由は？',
      o: ['真空チャックはコストが高いため', '水分で真空が破れ、裏面吸着は痕を残し裏面洗浄も妨げるため', '機械式の方が低回転にできるため', '真空チャックは高温に耐えないため'],
      e: 'ウェット環境では水分により真空が失われる。また裏面全体を吸着すると接触痕が残り、裏面洗浄もできない。エッジグリップは端部0.5〜1 mmのみに接触し、遠心力で自己増圧するため高速ほど保持力が増す。' }
  },
  {
    a: 2,
    zh: { q: 'SC-1 (APM) 去除顆粒的主要機制是什麼？',
      o: ['靠高溫把顆粒蒸發', '靠強酸溶解顆粒本身', 'H2O2 氧化矽表面、NH4OH 微蝕該氧化層，把顆粒連底挖起並以同性電荷排斥防止再附著', '靠兆聲波單獨把顆粒震落'],
      e: 'SC-1 是化學＋靜電雙重機制：氧化—微蝕造成 undercut lift-off，鹼性環境使顆粒與晶圓表面同帶負電而互相排斥。兆聲波是可選的物理輔助，不是主機制。' },
    en: { q: 'What is the main particle-removal mechanism of SC-1 (APM)?',
      o: ['High temperature evaporates the particles', 'Strong acid dissolves the particles themselves', 'H2O2 oxidizes the silicon, NH4OH slightly etches that oxide to undercut particles, and like charges then prevent re-deposition', 'Megasonic energy alone shakes particles off'],
      e: 'SC-1 works chemically and electrostatically: oxidation plus slight etching undercuts and lifts particles off, while the alkaline environment gives both particle and surface a negative charge so they repel. Megasonic is optional physical assistance, not the main mechanism.' },
    ja: { q: 'SC-1（APM）の主なパーティクル除去メカニズムは？',
      o: ['高温でパーティクルを蒸発させる', '強酸がパーティクル自体を溶解する', 'H2O2がSi表面を酸化し、NH4OHがその酸化膜を微小エッチしてパーティクルを持ち上げ、同符号帯電で再付着を防ぐ', 'メガソニックのみで振り落とす'],
      e: 'SC-1は化学的作用と静電的作用の複合である。酸化と微小エッチによるアンダーカット・リフトオフに加え、アルカリ環境で粒子と表面が共に負に帯電して反発する。メガソニックは補助的な物理力にすぎない。' }
  },
  {
    a: 0,
    zh: { q: '可升降分液杯 (multi-level cup) 切換高度的目的是？',
      o: ['讓不同藥液的廢液打到不同層擋板，導向各自的排液口，不需閥門接觸廢液', '調整晶圓與噴嘴的距離', '改變腔室的排氣量', '避免晶圓在高速時飛出'],
      e: '杯體是多層同心擋板。在某一高度時，甩出的液流只會打到對應那一層並沿其溝槽流到專屬排液口，因此「切換高度＝切換廢液分流」，避免酸鹼混合並符合廢水處理規定。' },
    en: { q: 'Why does the multi-level splash cup change height between steps?',
      o: ['So each chemistry strikes a different baffle level and drains to its own port, with no valve touching the effluent', 'To adjust the wafer-to-nozzle distance', 'To change chamber exhaust volume', 'To stop the wafer flying out at speed'],
      e: 'The cup is a nest of concentric baffles. At a given height the thrown-off liquid can only hit the matching level and runs to its dedicated drain, so changing height switches waste segregation — keeping acid and base apart and meeting waste-treatment rules.' },
    ja: { q: '昇降式多段カップがステップごとに高さを変える目的は？',
      o: ['薬液ごとに異なる段のバッフルへ当て、専用排液口へ導くため（廃液に触れる弁が不要）', 'ウェーハとノズルの距離調整のため', 'チャンバー排気量を変えるため', '高速時のウェーハ飛散防止のため'],
      e: 'カップは同心の多段バッフル構造。ある高さでは振り切られた液が対応段にのみ当たり専用排液口へ流れるため、高さ切替＝廃液分別の切替となる。酸とアルカリの混合を防ぎ、排水処理規定にも適合する。' }
  },
  {
    a: 3,
    zh: { q: 'IPA 乾燥 (Marangoni) 能避免 watermark 的原因是？',
      o: ['IPA 蒸發速度比水快很多，所以先乾', 'IPA 會把雜質溶解成氣體', 'IPA 提高水的表面張力使水凝成大水珠被甩掉', 'IPA 降低水膜邊界的表面張力，形成張力梯度主動把水「拉離」晶圓，水中雜質被一併帶走而不會濃縮'],
      e: '關鍵在於水是被「拉走」而不是「蒸發掉」。蒸發會讓溶在水裡的雜質留在原地濃縮成 watermark；Marangoni 流則把整團水連同雜質帶離表面。這也同時降低高深寬比圖形的毛細力倒塌。' },
    en: { q: 'Why does IPA (Marangoni) drying avoid watermarks?',
      o: ['IPA evaporates much faster than water so it dries first', 'IPA turns impurities into gas', 'IPA raises water surface tension so droplets bead up and fly off', 'IPA lowers surface tension at the film edge, and the resulting gradient actively pulls water off the wafer, carrying dissolved impurities away instead of concentrating them'],
      e: 'The point is that the water is pulled away rather than evaporated. Evaporation leaves dissolved impurities behind to concentrate into a watermark; Marangoni flow removes the water and its impurities together. It also reduces capillary pattern collapse on high-aspect-ratio features.' },
    ja: { q: 'IPA（マランゴニ）乾燥がウォーターマークを防げる理由は？',
      o: ['IPAは水より蒸発が速いから', 'IPAが不純物を気体に変えるから', 'IPAが水の表面張力を上げて水滴を振り飛ばすから', 'IPAが水膜縁の表面張力を下げ、その勾配が水を能動的に引き剥がすため、溶存不純物も一緒に運び去られ濃縮しないから'],
      e: '重要なのは水が「蒸発」ではなく「引き去られる」点。蒸発では溶存不純物がその場に残り濃縮してウォーターマークになるが、マランゴニ流は水ごと不純物を運び去る。高アスペクト比パターンの毛細管倒れも低減できる。' }
  },
  {
    a: 1,
    zh: { q: '為什麼藥液擺臂要邊供液邊來回掃描，而不是固定在晶圓中心供液？',
      o: ['為了縮短製程時間', '固定中心供液會讓中心停留時間長、邊緣短，形成碗形不均勻分佈；掃描可用停留時間補償拉平蝕刻量', '為了避免噴嘴過熱', '為了讓藥液用量變多'],
      e: '晶圓的面積隨半徑增加，外圈需要更多藥液與停留時間。掃描擺臂的速度曲線 (外圈慢、內圈快) 就是調整 within-wafer 均勻性的主要旋鈕。' },
    en: { q: 'Why does the chemical arm scan while dispensing instead of sitting at wafer center?',
      o: ['To shorten process time', 'A fixed center dispense dwells long at the center and briefly at the edge, giving a bowl-shaped profile; scanning applies dwell-time compensation to flatten removal', 'To keep the nozzle from overheating', 'To increase chemical consumption'],
      e: 'Wafer area grows with radius, so the outer region needs more chemistry and dwell time. The arm speed profile — slower outboard, faster inboard — is the main knob for within-wafer uniformity.' },
    ja: { q: '薬液アームが吐出しながら走査するのはなぜ？（中心固定にしない理由）',
      o: ['処理時間短縮のため', '中心固定では中心の滞留時間が長く端が短いためお椀型分布になる。走査による滞留時間補正で除去量を平坦化するため', 'ノズルの過熱防止のため', '薬液使用量を増やすため'],
      e: 'ウェーハ面積は半径とともに増えるため、外周ほど多くの薬液と滞留時間が必要になる。アームの速度プロファイル（外周は遅く、内周は速く）が面内均一性の主要な調整因子である。' }
  },
  {
    a: 2,
    zh: { q: '噴嘴待機杯 (standby pot) 的「預噴 (pre-dispense)」主要解決什麼問題？',
      o: ['降低藥液成本', '減少排氣量', '管路內滯留的液體可能降溫、濃度改變或含氣泡，先噴掉可確保打到晶圓的是新鮮到溫的藥液，避免首片效應', '增加噴嘴壽命'],
      e: '首片效應 (first wafer effect) 常來自停機後管內滯留液的溫度與濃度漂移。預噴與噴嘴口保濕 (避免結晶) 是控制首片良率的關鍵設計。' },
    en: { q: 'What problem does pre-dispense at the standby pot mainly solve?',
      o: ['Lower chemical cost', 'Less exhaust volume', 'Liquid sitting in the line may be cold, off-concentration or full of air, so purging it first ensures the wafer sees fresh chemistry at temperature — avoiding first-wafer effect', 'Longer nozzle life'],
      e: 'First-wafer effect usually comes from temperature and concentration drift in liquid left standing in the line after an idle period. Pre-dispense plus tip wetting (to prevent crystallization) is the key design for first-wafer yield.' },
    ja: { q: '待機ポットでのプリディスペンスが主に解決する課題は？',
      o: ['薬液コストの低減', '排気量の削減', '配管内の滞留液は温度低下・濃度変化・気泡を含む可能性があり、先に捨てることで新鮮で所定温度の薬液のみをウェーハに当て、ファーストウェーハ効果を防ぐ', 'ノズル寿命の延長'],
      e: 'ファーストウェーハ効果は、停止後に配管内へ滞留した液の温度・濃度ドリフトが主因。プリディスペンスと先端の保湿（結晶化防止）が初品歩留りを左右する重要設計である。' }
  },
  {
    a: 0,
    zh: { q: '腔室排氣量在配方中通常「不是固定值」，原因是？',
      o: ['排氣太小霧滴會回沉造成缺陷，太大則擾亂氣流、稀釋 IPA 濃度造成乾燥不良，因此需依步驟調整', '排氣量固定會使電費過高', '排氣量會影響晶圓轉速', '排氣量必須與潔淨室壓力完全相同'],
      e: '供液時需要較大排氣把霧滴抽走；乾燥時排氣過強反而會把顆粒捲回並讓 IPA 蒸氣不足。排氣與頂部下吹流量必須成對調校，是常被忽略但影響很大的製程參數。' },
    en: { q: 'Why is chamber exhaust usually NOT a fixed value across a recipe?',
      o: ['Too little lets mist settle as defects, too much disturbs airflow and thins IPA vapor causing poor dry — so it is tuned per step', 'A fixed value would cost too much electricity', 'Exhaust changes the wafer spin speed', 'Exhaust must exactly match cleanroom pressure'],
      e: 'Dispense steps need more exhaust to pull mist away; during dry, excessive draw entrains particles back and starves the IPA vapor. Exhaust and top down-flow must be balanced together — an easily overlooked parameter with a large process effect.' },
    ja: { q: 'チャンバー排気量がレシピ中で固定値でないのはなぜ？',
      o: ['排気が少なすぎるとミスト再付着で欠陥、多すぎると気流を乱しIPA濃度も薄まり乾燥不良となるため、ステップごとに調整する', '固定すると電気代が高いため', '排気量がウェーハ回転数を変えるため', 'クリーンルーム圧力と完全一致させる必要があるため'],
      e: '吐出中はミスト排出のため排気を強め、乾燥時は強すぎるとパーティクルを巻き戻しIPA蒸気も不足する。排気とダウンフローは対で調整すべき、見落とされがちだが影響の大きいパラメータである。' }
  },
  {
    a: 3,
    zh: { q: '為什麼製程搬送機械手常配置「乾臂」與「濕臂」兩支手？',
      o: ['為了提高搬送速度', '為了備援，其中一支故障可換另一支', '為了同時搬運兩片不同尺寸晶圓', '避免剛清洗完的濕晶圓殘留藥液污染未清洗或已乾燥的晶圓，形成交叉污染'],
      e: '雙臂確實也能提升節拍，但配置乾/濕臂的核心理由是污染管控：濕臂專門取剛清洗完的晶圓，乾臂只碰乾燥面，避免把藥液與顆粒帶回乾淨晶圓。' },
    en: { q: 'Why does the process transfer robot commonly have a "dry hand" and a "wet hand"?',
      o: ['To transfer faster', 'For redundancy if one hand fails', 'To carry two wafer sizes at once', 'To stop residual chemistry from freshly cleaned wet wafers cross-contaminating uncleaned or dried wafers'],
      e: 'Dual arms do help cadence, but the reason for splitting dry and wet is contamination control: the wet hand only handles freshly cleaned wafers and the dry hand only touches dry surfaces, so chemistry and particles are never carried back.' },
    ja: { q: 'プロセス搬送ロボットが「ドライハンド」と「ウェットハンド」を持つ主な理由は？',
      o: ['搬送速度を上げるため', '片方が故障したときの冗長化のため', '異なるサイズのウェーハを同時に運ぶため', '洗浄直後のウェットウェーハの残液が、未洗浄や乾燥済みウェーハを汚染するクロスコンタミを防ぐため'],
      e: '双腕はタクト向上にも寄与するが、ドライ／ウェットを分ける本質的理由は汚染管理である。ウェットハンドは洗浄直後のみ、ドライハンドは乾燥面のみを扱い、薬液やパーティクルを清浄面へ戻さない。' }
  }
];
