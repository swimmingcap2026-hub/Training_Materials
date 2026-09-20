// ---------------------------------------------------------------------------
// Component knowledge base.
// Each entry: id, group, color, and per-language {name, fn, pr, sp, rk}.
//   fn = function / 功能, pr = principle / 原理,
//   sp = key parameters / 重點, rk = cautions / 注意事項
// ---------------------------------------------------------------------------

export const TOOL_PARTS = [
  {
    id: 'frame', group: 'control', color: 0x8792a8,
    zh: {
      name: '機台主框架 / 底座',
      fn: '承載 EFEM、製程腔室、配管層與電控櫃的鋼構骨架，並提供水平調整與防震介面。',
      pr: '以焊接方型鋼管構成剛性籠狀結構，底部以可調水平腳 (leveling pad) 支撐。框架剛性決定旋轉腔室在高轉速下的振動位移量；若剛性不足，主軸不平衡力會放大成晶圓上的液膜抖動與顆粒再附著。',
      sp: '水平度一般要求 0.1 mm/m 以內；防震腳需與潔淨室架高地板梁位對齊；接地電阻 < 1 Ω。',
      rk: '地板梁位錯位造成共振、水平跑掉導致排液不順而積液、搬運後未重新校水平造成搬送手臂教點偏移。'
    },
    en: {
      name: 'Main Frame / Base',
      fn: 'Steel structure that carries the EFEM, process chambers, plumbing deck and electrical cabinet, and provides leveling and vibration interfaces.',
      pr: 'A welded rectangular-tube cage gives rigidity, supported on adjustable leveling pads. Frame stiffness sets how much the spinning chamber deflects at high RPM; a soft frame amplifies spindle imbalance into liquid-film chatter and particle re-deposition on the wafer.',
      sp: 'Typical leveling spec within 0.1 mm/m; isolation feet must sit over raised-floor beams; grounding resistance < 1 Ω.',
      rk: 'Resonance from misaligned floor beams, standing liquid when level drifts and drains stop sloping, robot teach points shifting after a tool move.'
    },
    ja: {
      name: '本体フレーム / ベース',
      fn: 'EFEM、プロセスチャンバー、配管デッキ、電装盤を支える鋼構造。レベル調整と防振のインターフェースも兼ねる。',
      pr: '角パイプ溶接のケージ構造で剛性を確保し、調整脚（レベリングパッド）で支持する。フレーム剛性は高回転時のチャンバー変位量を決め、剛性不足だと主軸の不釣合い力が液膜の乱れやパーティクル再付着に増幅される。',
      sp: 'レベル精度は一般に 0.1 mm/m 以内、防振脚はフリーアクセス床の梁位置に合わせる、接地抵抗 1 Ω 未満。',
      rk: '梁位置ずれによる共振、レベル狂いによる排液不良と液溜まり、移設後のティーチング点ずれ。'
    }
  },
  {
    id: 'enclosure', group: 'control', color: 0xdfe6ee, shell: true,
    zh: {
      name: '外殼面板 / 安全門',
      fn: '包覆機台、維持機內負壓氣流、隔絕藥液噴濺與噪音，並以連鎖開關 (interlock) 保護人員。',
      pr: '面板內側為耐酸鹼塗裝或 PP/PVC 內襯，門邊裝有磁簧或機械式安全開關。門一開，PLC 立即切斷高轉速與供液指令，使腔室降到安全轉速。負壓設計確保任何洩漏氣流由外向內流入排氣，而不外洩到潔淨室。',
      sp: '機內相對潔淨室維持微負壓 (約 −5 ～ −20 Pa)；門連鎖需列入年度安全稽核。',
      rk: '門封條老化造成負壓不足、interlock 被短接 (嚴重違規)、面板腐蝕造成金屬污染源。'
    },
    en: {
      name: 'Enclosure Panels / Safety Doors',
      fn: 'Encloses the tool, maintains the internal negative-pressure airflow, contains chemical splash and noise, and protects personnel via interlocks.',
      pr: 'Panels are chemically resistant coated or PP/PVC lined, with reed or mechanical safety switches at each door. Opening a door makes the PLC immediately drop spin speed and cut dispense. Negative pressure ensures any leak flows inward to exhaust rather than out into the cleanroom.',
      sp: 'Tool interior held slightly negative to the fab (about −5 to −20 Pa); door interlocks belong in the annual safety audit.',
      rk: 'Aged door seals losing negative pressure, bypassed interlocks (a serious violation), corroded panels becoming a metal contamination source.'
    },
    ja: {
      name: '外装パネル / 安全扉',
      fn: '装置を覆い、内部の負圧気流を保ち、薬液の飛散と騒音を遮断し、インターロックで作業者を保護する。',
      pr: 'パネル内側は耐薬塗装または PP/PVC ライニング、扉にはリードスイッチや機械式安全スイッチを設置。扉を開くと PLC が即座に高速回転と供給を停止する。負圧設計により、漏れがあっても気流は内向きに排気へ流れ、クリーンルーム側へ出ない。',
      sp: '装置内はクリーンルームに対し微負圧（約 −5〜−20 Pa）。扉インターロックは年次安全監査の対象。',
      rk: 'シール劣化による負圧不足、インターロックの無効化（重大違反）、パネル腐食による金属汚染。'
    }
  },
  {
    id: 'load_port', group: 'efem', color: 0x2f80ed,
    zh: {
      name: '晶圓載入埠 (Load Port) ×4',
      fn: '承接 FOUP，自動開啟前門並將晶盒內環境與 EFEM 連通，供搬送手臂取放晶圓。',
      pr: '符合 SEMI E15/E47 的 FIMS 介面：夾持銷固定 FOUP → 門把手旋轉解鎖 → 門板連同晶圓映射感測器一起向內、向下移開。映射 (mapping) 由穿越式或反射式感測器在門下降過程掃描 25 個槽位，判斷有無晶圓、雙片 (double slot) 或斜片 (cross slot)。',
      sp: '300 mm、25 槽、槽距 10 mm；映射需能辨識 double/cross slot；載入埠底部常設 N2 吹掃 (purge port)。',
      rk: '映射誤判導致取片碰撞、FOUP 底板定位銷磨耗、門封不良使晶盒內濕度上升造成 Q-time 問題。'
    },
    en: {
      name: 'Load Ports (FOUP) ×4',
      fn: 'Receive the FOUP, open its door automatically and connect the carrier interior to the EFEM so the robot can pick and place wafers.',
      pr: 'A SEMI E15/E47 FIMS interface: kinematic pins clamp the FOUP, the latch key rotates to unlock, then the door plate — carrying the mapping sensor — retracts inward and down. During that stroke a through-beam or reflective sensor scans all 25 slots to detect missing wafers, double slots and cross slots.',
      sp: '300 mm, 25 slots at 10 mm pitch; mapping must catch double/cross slot; a N2 purge port is common at the port base.',
      rk: 'Mapping errors causing pick crashes, worn kinematic pins, poor door seal raising carrier humidity and creating Q-time issues.'
    },
    ja: {
      name: 'ロードポート (FOUP) ×4',
      fn: 'FOUP を受け入れ、前扉を自動開放してキャリア内部と EFEM をつなぎ、搬送ロボットがウェーハを出し入れできるようにする。',
      pr: 'SEMI E15/E47 準拠の FIMS インターフェース。位置決めピンで FOUP を固定し、ラッチキーを回して解錠、扉板をマッピングセンサごと内側・下方へ退避させる。この動作中に透過式または反射式センサが 25 スロットを走査し、無ウェーハ・ダブルスロット・クロススロットを判定する。',
      sp: '300 mm・25 枚・ピッチ 10 mm。ダブル/クロススロット検出が必須。ポート下部に N2 パージ機構を備えることが多い。',
      rk: 'マッピング誤判定によるピック衝突、位置決めピンの摩耗、扉シール不良によるキャリア内湿度上昇と Q-time 問題。'
    }
  },
  {
    id: 'foup', group: 'efem', color: 0xf2994a,
    zh: {
      name: 'FOUP 晶圓傳送盒',
      fn: '在廠內以密閉方式運送 25 片 300 mm 晶圓，維持晶圓間的潔淨微環境。',
      pr: '以 PC/PEEK 材質成形，內部為 25 對齒槽 (teeth)。密閉後形成微環境，可再以 N2 吹掃降低水氣與氧氣，抑制自然氧化層成長與 AMC (氣態分子污染) 附著。這是控制清洗後 Q-time 的關鍵。',
      sp: '槽距 10 mm；N2 purge 後盒內濕度可壓到 < 5 %RH；盒身 RFID/條碼供 MES 追蹤。',
      rk: '齒槽磨耗產生塑膠微粒、清洗後晶圓未及時 purge 造成 watermark 或再氧化、FOUP 外部沾污帶入機台。'
    },
    en: {
      name: 'FOUP Wafer Carrier',
      fn: 'Transports 25 × 300 mm wafers through the fab in a sealed mini-environment.',
      pr: 'Molded from PC/PEEK with 25 pairs of teeth. Once sealed it forms a mini-environment that can be N2 purged to cut moisture and oxygen, suppressing native-oxide regrowth and airborne molecular contamination (AMC) — the key lever for post-clean Q-time control.',
      sp: '10 mm slot pitch; purged carriers can reach < 5 %RH; RFID/barcode on the shell for MES tracking.',
      rk: 'Worn teeth shedding plastic particles, un-purged wafers after cleaning showing watermarks or re-oxidation, dirty FOUP exteriors carried into the tool.'
    },
    ja: {
      name: 'FOUP ウェーハキャリア',
      fn: '300 mm ウェーハ 25 枚を密閉状態で工場内搬送し、清浄なミニエンバイロメントを維持する。',
      pr: 'PC/PEEK 成形で内部に 25 対のティースを持つ。密閉後は N2 パージで水分と酸素を低減し、自然酸化膜の再成長と AMC（気中分子汚染）の付着を抑える。洗浄後の Q-time 管理の要となる。',
      sp: 'スロットピッチ 10 mm。パージ後は庫内湿度 5 %RH 未満も可能。RFID/バーコードで MES 追跡。',
      rk: 'ティース摩耗による樹脂パーティクル、洗浄後の未パージによるウォーターマークや再酸化、FOUP 外面の汚れ持ち込み。'
    }
  },
  {
    id: 'efem_body', group: 'efem', color: 0xd9e2ec, shell: true,
    zh: {
      name: 'EFEM 本體 (大氣搬送室)',
      fn: '連接 Load Port 與製程區的大氣潔淨搬送空間，內含搬送手臂與對準器。',
      pr: '頂部 FFU 送出垂直層流，底部回風或排氣形成單向流 (unidirectional flow)，把手臂動作揚起的顆粒往下帶走。濕製程機台的 EFEM 常維持微正壓以阻擋製程區酸霧回流，同時對 Load Port 側維持潔淨度 Class 1 等級。',
      sp: '面風速約 0.3–0.45 m/s；潔淨度 ISO Class 1–3；濕度常控在 40 %RH 以下以抑制水痕。',
      rk: '層流被治具或線槽擾亂形成渦流、FFU 濾網堵塞使風速下降、酸霧從製程側回流腐蝕手臂。'
    },
    en: {
      name: 'EFEM Body (Atmospheric Transfer)',
      fn: 'The clean atmospheric transfer space linking the load ports to the process section; houses the atmospheric robot and aligner.',
      pr: 'An FFU on top produces vertical laminar flow with return or exhaust at the bottom, so particles stirred up by robot motion are swept downward. On wet tools the EFEM is usually held slightly positive against the process section to block acid-mist backflow, while keeping Class 1 cleanliness at the load-port face.',
      sp: 'Face velocity about 0.3–0.45 m/s; ISO Class 1–3; humidity often kept below 40 %RH to suppress watermarks.',
      rk: 'Fixtures or cable ducts breaking the laminar flow into eddies, clogged FFU filters lowering velocity, acid mist migrating from the process side and corroding the robot.'
    },
    ja: {
      name: 'EFEM 本体（大気搬送室）',
      fn: 'ロードポートとプロセス部をつなぐ大気クリーン搬送空間。搬送ロボットとアライナを内蔵する。',
      pr: '上部 FFU が垂直層流を作り、下部の還気・排気で一方向流を形成して、ロボット動作で舞ったパーティクルを下方へ排出する。ウェット装置では EFEM をプロセス側に対し微正圧に保ち、酸ミストの逆流を防ぎつつ、ロードポート面の清浄度をクラス1級に維持する。',
      sp: '面風速 0.3〜0.45 m/s、清浄度 ISO クラス1〜3、ウォーターマーク抑制のため湿度 40 %RH 以下が一般的。',
      rk: '治具や配線ダクトによる層流の乱れ、FFU フィルタ目詰まりによる風速低下、プロセス側からの酸ミスト逆流によるロボット腐食。'
    }
  },
  {
    id: 'ffu', group: 'efem', color: 0x27ae60,
    zh: {
      name: 'FFU 風扇過濾機組 (ULPA)',
      fn: '對 EFEM 與製程區送出經 ULPA 過濾的潔淨空氣，形成由上而下的單向層流。',
      pr: '離心風機把空氣加壓通過 ULPA 濾材，對 0.12 µm 粒徑效率可達 99.9995 %。濾材阻力隨積塵上升，風機以壓差回授或轉速控制維持定風速。層流是「把顆粒帶離晶圓」的主要機制，因此風速均勻度比絕對風速更重要。',
      sp: '濾材效率 ULPA U15 以上；風速均勻度 ±10 %；壓差達初始值 1.5–2 倍即需更換濾網。',
      rk: '濾網破損 (pinhole) 造成顆粒突增、風機軸承劣化引起振動、更換濾網後未做風速與潔淨度驗證。'
    },
    en: {
      name: 'Fan Filter Unit (ULPA)',
      fn: 'Supplies ULPA-filtered air to the EFEM and process section, creating top-down unidirectional laminar flow.',
      pr: 'A centrifugal blower pushes air through ULPA media rated up to 99.9995 % at 0.12 µm. Media resistance rises as it loads, so the fan runs on differential-pressure feedback or speed control to hold constant face velocity. Laminar flow is the main mechanism sweeping particles away from the wafer, so flow uniformity matters more than absolute velocity.',
      sp: 'ULPA U15 or better; velocity uniformity ±10 %; replace media when ΔP reaches 1.5–2× the initial value.',
      rk: 'Filter pinholes causing particle excursions, worn blower bearings adding vibration, skipping velocity and cleanliness verification after a filter change.'
    },
    ja: {
      name: 'ファンフィルタユニット (ULPA)',
      fn: 'EFEM とプロセス部へ ULPA 濾過した清浄空気を送り、上から下への一方向層流を形成する。',
      pr: '遠心ファンで加圧した空気を ULPA 濾材に通し、0.12 µm 粒子に対して 99.9995 % の捕集効率を得る。濾材は目詰まりで圧損が上がるため、差圧フィードバックや回転数制御で面風速を一定に保つ。層流はパーティクルをウェーハから運び去る主機構であり、絶対風速より風速均一性が重要。',
      sp: 'ULPA U15 以上、風速均一性 ±10 %、差圧が初期値の1.5〜2倍で濾材交換。',
      rk: '濾材ピンホールによるパーティクル急増、ファン軸受劣化による振動、交換後の風速・清浄度検証の未実施。'
    }
  },
  {
    id: 'atm_robot', group: 'transfer', color: 0xf2c94c,
    zh: {
      name: '大氣搬送機械手 (ATM Robot)',
      fn: '在 Load Port、對準器與製程交接站之間搬送晶圓，通常為雙臂 (dual arm) 以縮短交換時間。',
      pr: 'SCARA 連桿由伺服馬達驅動，各軸經諧波減速機取得高剛性與低背隙；末端 (end effector) 對乾晶圓多用真空吸附，對濕晶圓則改用邊緣夾持 (edge grip) 或 Bernoulli 手爪以免背面沾液。位置精度靠教點 (teaching) 與編碼器閉迴路維持，並由 mapping/present 感測器做防呆。',
      sp: '重複精度約 ±0.1 mm；末端材質 PEEK 或 SiC；濕側手爪需耐 HF 與熱 DIW。',
      rk: '真空破真空造成掉片、edge grip 墊片磨耗造成滑移、教點偏移導致刮傷 FOUP 齒槽、手爪殘液交叉污染。'
    },
    en: {
      name: 'Atmospheric Robot (ATM Robot)',
      fn: 'Moves wafers between load ports, aligner and the process hand-off station; usually dual-arm to shorten swap time.',
      pr: 'A servo-driven SCARA linkage uses harmonic drives for stiffness and low backlash. End effectors use vacuum for dry wafers, but edge-grip or Bernoulli hands for wet wafers so the backside is never touched by liquid. Position accuracy comes from teaching plus closed-loop encoders, backed by mapping and wafer-present sensors.',
      sp: 'Repeatability around ±0.1 mm; PEEK or SiC end effectors; wet-side hands must resist HF and hot DIW.',
      rk: 'Vacuum loss dropping a wafer, worn edge-grip pads letting the wafer slip, teach drift scratching FOUP teeth, residual liquid on the hand cross-contaminating.'
    },
    ja: {
      name: '大気搬送ロボット (ATM ロボット)',
      fn: 'ロードポート、アライナ、プロセス受渡ステーション間でウェーハを搬送する。交換時間短縮のため通常はデュアルアーム。',
      pr: 'サーボ駆動の SCARA リンクに波動歯車減速機を用い、高剛性・低バックラッシを得る。エンドエフェクタは乾燥ウェーハには真空吸着、ウェットウェーハには裏面に液を付けないエッジグリップやベルヌーイハンドを使う。位置精度はティーチングとエンコーダ閉ループで維持し、マッピング/在荷センサで誤動作を防ぐ。',
      sp: '繰返し精度 ±0.1 mm 程度、エンドエフェクタ材質は PEEK または SiC、ウェット側は HF・温純水耐性が必要。',
      rk: '真空喪失によるウェーハ落下、エッジグリップパッド摩耗による滑り、ティーチずれによる FOUP ティース傷、ハンド残液によるクロスコンタミ。'
    }
  },
  {
    id: 'aligner', group: 'transfer', color: 0x9b51e0,
    zh: {
      name: '晶圓對準器 (Notch Aligner)',
      fn: '找出晶圓缺口 (notch) 與中心偏心量，把晶圓方位與偏心修正到規格內再送入腔室。',
      pr: '晶圓放在旋轉載台上低速旋轉，線性 CCD 或雷射感測器量測邊緣輪廓；輪廓的正弦變化量給出偏心 (eccentricity)，突變點即是 notch 角度。控制器計算後由對準器或機械手做補正。對濕製程而言，偏心會讓旋轉甩液不對稱，直接影響邊緣清洗與乾燥均勻性。',
      sp: '角度精度約 ±0.05°、偏心精度約 ±0.05 mm；讀取 OCR/ID 字碼亦常整合在此。',
      rk: '載台真空孔積塵造成滑動、CCD 鏡面沾污使邊緣判讀失敗、晶圓背面顆粒被壓入。'
    },
    en: {
      name: 'Wafer Aligner (Notch Aligner)',
      fn: 'Finds the wafer notch and centering error, then corrects orientation and eccentricity before the wafer enters a chamber.',
      pr: 'The wafer spins slowly on a chuck while a line CCD or laser sensor traces the edge profile. The sinusoidal component of that profile gives eccentricity; the discontinuity marks the notch angle. The controller then corrects via the aligner stage or the robot. On a wet tool, eccentricity makes liquid throw-off asymmetric and directly degrades bevel clean and dry uniformity.',
      sp: 'Angular accuracy about ±0.05°, centering about ±0.05 mm; wafer ID/OCR reading is often integrated here.',
      rk: 'Dust in the chuck vacuum holes causing slip, a contaminated CCD window failing edge detection, backside particles pressed into the wafer.'
    },
    ja: {
      name: 'ウェーハアライナ（ノッチアライナ）',
      fn: 'ウェーハのノッチ位置と偏心量を検出し、方位と芯出しを規格内に補正してからチャンバーへ渡す。',
      pr: '回転ステージ上でウェーハを低速回転させ、ラインCCDやレーザセンサでエッジ輪郭を測定する。輪郭の正弦成分が偏心量、不連続点がノッチ角度を示す。コントローラが算出し、アライナまたはロボットが補正する。ウェット工程では偏心があると振り切りが非対称になり、ベベル洗浄と乾燥の均一性に直結する。',
      sp: '角度精度 ±0.05° 程度、芯出し精度 ±0.05 mm 程度。ウェーハ ID/OCR 読取も統合されることが多い。',
      rk: 'ステージ真空穴の塵による滑り、CCD 窓の汚れによるエッジ検出不良、裏面パーティクルの押し込み。'
    }
  },
  {
    id: 'transfer_robot', group: 'transfer', color: 0xeb5757,
    zh: {
      name: '製程搬送機械手 (雙臂 / 行走軸)',
      fn: '沿直線軸移動，把晶圓送入 12 個製程腔室並取出已清洗的晶圓。',
      pr: '典型配置為「乾臂 + 濕臂」：乾臂只碰未清洗或已乾燥晶圓，濕臂專門取出剛清洗完的晶圓，藉此避免把藥液或顆粒帶回乾淨面。行走軸以線性馬達或滾珠螺桿驅動，具備防水波紋護罩；手臂進出腔室的時序須與杯體升降、閘門開闔嚴格連鎖。',
      sp: '搬送節拍決定產能：12 腔室、單片製程 60–90 s 時，機械手需在數秒內完成交換；重複精度 ±0.1 mm。',
      rk: '濕臂滴液污染下方腔室、行走軸護罩破損造成腐蝕、interlock 時序錯誤造成手臂與杯體碰撞破片。'
    },
    en: {
      name: 'Process Transfer Robot (Dual Arm on Rail)',
      fn: 'Travels on a linear axis to load wafers into the 12 process chambers and retrieve cleaned wafers.',
      pr: 'Typically a "dry hand + wet hand" pair: the dry hand only touches uncleaned or dried wafers, the wet hand handles freshly cleaned ones, so chemistry and particles are never carried back to clean surfaces. The travel axis runs on a linear motor or ball screw behind a splash-proof bellows. Arm entry timing is hard-interlocked with cup elevation and shutter opening.',
      sp: 'Transfer cadence sets throughput: with 12 chambers at 60–90 s per wafer, each swap must finish in seconds; repeatability ±0.1 mm.',
      rk: 'The wet hand dripping into the chamber below, a torn bellows letting mist corrode the axis, interlock timing errors crashing the arm into the cup and breaking a wafer.'
    },
    ja: {
      name: 'プロセス搬送ロボット（双腕 / 走行軸）',
      fn: '直線軸上を移動し、12 のプロセスチャンバーへウェーハを投入し、洗浄済みウェーハを取り出す。',
      pr: '一般に「ドライハンド＋ウェットハンド」の構成をとる。ドライハンドは未洗浄または乾燥済みのみ、ウェットハンドは洗浄直後のみを扱い、薬液やパーティクルを清浄面へ戻さない。走行軸はリニアモータまたはボールねじ駆動で、防水ベローズで保護する。アーム進入のタイミングはカップ昇降とシャッタ開閉に厳密にインターロックされる。',
      sp: '搬送タクトが生産能力を決める。12 チャンバー・1枚60〜90秒なら交換は数秒以内。繰返し精度 ±0.1 mm。',
      rk: 'ウェットハンドの液だれによる下部チャンバー汚染、ベローズ破損による軸の腐食、インターロック不整合によるカップとの衝突・ウェーハ割れ。'
    }
  },
  {
    id: 'robot_rail', group: 'transfer', color: 0x56617a,
    zh: {
      name: '直線行走軸 (Travel Axis)',
      fn: '提供機械手在多腔室之間的長行程移動，是決定搬送節拍的關鍵軸。',
      pr: '以線性導軌＋滾珠螺桿或線性馬達構成，位置由光學尺回授。為了在濕氣環境下運作，導軌採不鏽鋼或表面處理，並以伸縮護罩與微正壓 N2 隔絕酸霧。加減速曲線需做 S 型平滑處理，避免晶圓在手爪上滑移。',
      sp: '行程約 1.5–3 m；定位精度 ±0.05 mm；潤滑脂需選用耐化學型並列入 PM。',
      rk: '導軌鏽蝕造成位置誤差與異音、光學尺沾污造成失步、潤滑不足使馬達過電流跳機。'
    },
    en: {
      name: 'Linear Travel Axis',
      fn: 'Gives the robot its long stroke across the chamber bank; the axis that paces overall transfer throughput.',
      pr: 'Linear guides with a ball screw or linear motor, closed on an optical scale. For the humid environment the rails are stainless or surface treated and shielded by a telescopic cover with slight N2 overpressure to keep acid mist out. Motion profiles are S-curve smoothed so the wafer never slides on the end effector.',
      sp: 'Stroke roughly 1.5–3 m; positioning accuracy ±0.05 mm; chemically resistant grease on a PM schedule.',
      rk: 'Rail corrosion causing position error and noise, a dirty optical scale causing lost counts, poor lubrication tripping the motor on overcurrent.'
    },
    ja: {
      name: '直線走行軸 (トラベルアクシス)',
      fn: 'ロボットが多数のチャンバー間を移動するための長ストローク軸。搬送タクトを左右する重要軸。',
      pr: 'リニアガイド＋ボールねじ、またはリニアモータで構成し、リニアスケールで位置をフィードバックする。多湿環境のためレールはステンレスや表面処理品とし、テレスコカバーと微正圧 N2 で酸ミストを遮断する。ウェーハがハンド上で滑らないよう S 字加減速で制御する。',
      sp: 'ストローク 1.5〜3 m、位置決め精度 ±0.05 mm、耐薬グリスを選定し PM 項目に入れる。',
      rk: 'レール腐食による位置誤差と異音、スケール汚れによる脱調、潤滑不足によるモータ過電流トリップ。'
    }
  },
  {
    id: 'chamber_stack', group: 'process', color: 0x00b8a9,
    zh: {
      name: '製程腔室組 (12 腔室 / 上下兩層)',
      fn: '機台的核心：每個腔室獨立完成一片晶圓的完整清洗與乾燥配方，可平行運轉以換取產能。',
      pr: '腔室以上下兩層、前後兩排配置在搬送軸兩側，縮短手臂行程。各腔室有獨立主軸、供液閥組與排液分流，因此可同時跑不同配方 (mixed recipe)。產能 = 腔室數 ÷ 單片製程時間，但受限於搬送機械手的交換節拍，實務上以「腔室數 × 使用率」評估。',
      sp: '常見 8–12 腔室；單片節拍 60–120 s；整機產能約 200–400 wph (依配方而定)。',
      rk: '單一腔室排液堵塞會影響鄰室排氣平衡、上層腔室洩漏滴到下層、腔室間 matching 不良造成製程分佈差異。'
    },
    en: {
      name: 'Process Chamber Bank (12 chambers, 2 levels)',
      fn: 'The heart of the tool: each chamber runs a full clean-and-dry recipe on one wafer, and they run in parallel for throughput.',
      pr: 'Chambers sit on two levels and two rows either side of the transfer axis to keep robot strokes short. Each has its own spindle, valve block and segregated drain, so different recipes can run simultaneously. Throughput = chamber count ÷ single-wafer time, capped by robot swap cadence, so in practice it is judged as chambers × utilization.',
      sp: 'Commonly 8–12 chambers; 60–120 s per wafer; roughly 200–400 wph depending on recipe.',
      rk: 'One clogged drain upsetting exhaust balance for its neighbors, an upper chamber leaking onto the one below, poor chamber-to-chamber matching spreading process results.'
    },
    ja: {
      name: 'プロセスチャンバー群（12 室・上下2段）',
      fn: '装置の中核。各チャンバーが1枚のウェーハに対し洗浄から乾燥までのレシピを完結させ、並列運転で生産性を稼ぐ。',
      pr: '搬送軸の両側に上下2段・前後2列で配置し、アームのストロークを短縮する。各室が独立した主軸・バルブブロック・分別排液を持つため、異なるレシピの同時運転（ミックスレシピ）が可能。生産能力＝チャンバー数÷1枚あたり処理時間だが、搬送タクトが上限となるため実務では「チャンバー数×稼働率」で評価する。',
      sp: '一般に 8〜12 室、1枚 60〜120 秒、装置能力は概ね 200〜400 wph（レシピ依存）。',
      rk: '1室の排液詰まりが隣室の排気バランスに影響、上段チャンバーの漏液が下段へ落下、室間マッチング不良によるプロセスばらつき。'
    }
  },
  {
    id: 'chem_cabinet', group: 'fluid', color: 0x2d9cdb,
    zh: {
      name: '藥液供應櫃 (CDS 介面)',
      fn: '接收廠務中央供應的 SC-1、SC-2、DHF、DIW 等藥液，做壓力調節、過濾與分配到各腔室。',
      pr: '每一路藥液經減壓閥穩壓、再經 PFA/PTFE 濾芯 (常見 0.05–0.2 µm) 濾除顆粒，最後由氣動隔膜閥分配。管路全為 PFA 並採全熔接 (flare/weld) 以避免金屬析出與死角 (dead leg)。櫃內維持強制排氣與洩漏偵測，屬於 SEMI S2 的化學品櫃規範。',
      sp: '供液壓力常見 0.1–0.3 MPa；濾芯壓差到設定值即更換；櫃內需有雙層防漏盤與洩漏感測。',
      rk: '濾芯氣泡未排淨造成流量不穩、死角滋生顆粒、更換藥液後未做充分 flush 造成交叉污染。'
    },
    en: {
      name: 'Chemical Supply Cabinet (CDS Interface)',
      fn: 'Takes SC-1, SC-2, DHF, DIW and other chemistries from central supply, regulates and filters them, and distributes to every chamber.',
      pr: 'Each line is pressure-regulated, filtered through PFA/PTFE cartridges (typically 0.05–0.2 µm) and distributed by pneumatic diaphragm valves. Tubing is all-PFA with flared or welded joints to avoid metal leaching and dead legs. The cabinet runs forced exhaust and leak detection per SEMI S2 chemical-cabinet practice.',
      sp: 'Supply pressure usually 0.1–0.3 MPa; change filters at the ΔP limit; double-containment tray and leak sensors required.',
      rk: 'Trapped air in a filter causing unstable flow, dead legs breeding particles, insufficient flush after a chemistry change causing cross-contamination.'
    },
    ja: {
      name: '薬液供給キャビネット (CDS インターフェース)',
      fn: '工場中央供給の SC-1、SC-2、DHF、純水などを受け入れ、圧力調整・濾過を行い各チャンバーへ分配する。',
      pr: '各系統を減圧弁で安定化し、PFA/PTFE フィルタ（一般に 0.05〜0.2 µm）でパーティクルを除去、エア駆動ダイヤフラム弁で分配する。配管は全 PFA でフレア／溶接接続とし、金属溶出とデッドレグを避ける。キャビネット内は強制排気と漏液検知を備え、SEMI S2 の薬品キャビネット要件に従う。',
      sp: '供給圧は一般に 0.1〜0.3 MPa、フィルタは差圧到達で交換、二重防液パンと漏液センサが必須。',
      rk: 'フィルタのエア抜き不足による流量変動、デッドレグでのパーティクル発生、薬液切替後のフラッシュ不足によるクロスコンタミ。'
    }
  },
  {
    id: 'mixing_unit', group: 'fluid', color: 0xff7a45,
    zh: {
      name: '混合 / 加熱單元 (Inline Mixer + Heater)',
      fn: '在使用點即時把 NH4OH / H2O2 / HF 與 DIW 依比例混合並加熱到配方溫度。',
      pr: '採 POU (point-of-use) 即時混合：各成分由流量計與比例閥控制，經靜態混合器均勻化，再由石英或 PFA 包覆的加熱器 (紅外線或阻抗式) 升溫，以 PID 控制出口溫度。即時混合的好處是避免 H2O2 分解導致的配比漂移 — 這也是 SC-1 蝕刻率隨時間變化的主因。',
      sp: 'SC-1 典型 NH4OH:H2O2:H2O = 1:1:5 ～ 1:2:50、45–70 °C；溫控精度常要求 ±1 °C。',
      rk: 'H2O2 分解使氨濃度相對升高造成表面粗糙 (micro-roughness)、加熱器過溫報警、混合比例計失準造成蝕刻率偏移。'
    },
    en: {
      name: 'Inline Mixing / Heating Unit',
      fn: 'Blends NH4OH / H2O2 / HF with DIW at the point of use and heats the mix to recipe temperature.',
      pr: 'Point-of-use blending: each component is metered by a flow meter and proportional valve, homogenized in a static mixer, then heated by a quartz or PFA-jacketed heater (IR or resistive) under PID outlet-temperature control. Mixing on demand avoids the ratio drift caused by H2O2 decomposition — the usual reason an SC-1 bath etch rate changes over time.',
      sp: 'Typical SC-1 NH4OH:H2O2:H2O from 1:1:5 to 1:2:50 at 45–70 °C; temperature control often specified at ±1 °C.',
      rk: 'H2O2 decomposition raising effective ammonia ratio and roughening the surface, heater over-temperature alarms, drifting ratio meters shifting etch rate.'
    },
    ja: {
      name: 'インライン混合 / 加熱ユニット',
      fn: 'NH4OH / H2O2 / HF と純水を使用直前に所定比率で混合し、レシピ温度まで加熱する。',
      pr: 'POU（使用点）混合方式。各成分を流量計と比例弁で計量し、スタティックミキサで均一化した後、石英または PFA 被覆ヒータ（赤外線／抵抗式）で昇温し、PID で出口温度を制御する。都度混合により H2O2 分解による配合ずれを避けられる。これはバッチ式 SC-1 のエッチレートが経時変化する主因でもある。',
      sp: 'SC-1 は NH4OH:H2O2:H2O = 1:1:5〜1:2:50、45〜70 °C が代表的。温度精度は ±1 °C を要求されることが多い。',
      rk: 'H2O2 分解によるアンモニア比上昇と表面ラフネス悪化、ヒータ過昇温アラーム、比率計の狂いによるエッチレート変動。'
    }
  },
  {
    id: 'pump_panel', group: 'fluid', color: 0x6fcf97,
    zh: {
      name: '泵浦與流量控制盤',
      fn: '提供各噴嘴穩定無脈動的藥液流量，並在配方切換時精準啟閉。',
      pr: '多採氣動或電動隔膜泵搭配脈動吸收器 (damper)，再以超音波或 Coriolis 流量計做閉迴路修正。半導體濕製程要求「無顆粒、無脈動、無金屬析出」，因此接液件全為 PFA/PTFE；閥門採 suck-back 設計，關閉時回吸微量液體避免噴嘴滴液 (dripping) 在晶圓上造成 spot 缺陷。',
      sp: '典型供液 0.5–2.0 L/min；流量精度 ±2 %；suck-back 量需與噴嘴配合調整。',
      rk: '隔膜破裂造成洩漏、damper 失效使流量脈動造成液膜不均、suck-back 過量吸入空氣造成噴嘴噴濺。'
    },
    en: {
      name: 'Pump & Flow Control Panel',
      fn: 'Delivers stable, pulse-free chemical flow to each nozzle and switches lines precisely during a recipe.',
      pr: 'Pneumatic or electric diaphragm pumps with pulsation dampers, closed on ultrasonic or Coriolis flow meters. Wet processing demands particle-free, pulse-free, metal-free delivery, so all wetted parts are PFA/PTFE. Valves use suck-back: on close they pull a small volume back so the nozzle cannot drip onto the wafer and create spot defects.',
      sp: 'Typical dispense 0.5–2.0 L/min; flow accuracy ±2 %; suck-back volume tuned per nozzle.',
      rk: 'Ruptured diaphragms leaking, a dead damper letting pulsation break film uniformity, excessive suck-back drawing air and making the nozzle spit.'
    },
    ja: {
      name: 'ポンプ・流量制御パネル',
      fn: '各ノズルへ脈動のない安定した薬液流量を供給し、レシピ切替時に正確に開閉する。',
      pr: 'エア駆動または電動ダイヤフラムポンプに脈動吸収ダンパを組み合わせ、超音波式やコリオリ式流量計で閉ループ制御する。ウェット工程では「無パーティクル・無脈動・金属溶出なし」が要求されるため、接液部は全て PFA/PTFE。バルブはサックバック機構を持ち、閉時に微量を吸い戻してノズルの液だれによるスポット欠陥を防ぐ。',
      sp: '代表的な供給量 0.5〜2.0 L/min、流量精度 ±2 %、サックバック量はノズルごとに調整。',
      rk: 'ダイヤフラム破損による漏液、ダンパ失効による脈動と液膜不均一、サックバック過大によるエア吸込みとノズル飛散。'
    }
  },
  {
    id: 'n2_ipa_unit', group: 'fluid', color: 0xbb6bd9,
    zh: {
      name: 'IPA 汽化 / N2 供應單元',
      fn: '產生 IPA 蒸氣或 IPA/N2 混合流，供乾燥步驟使用；同時提供各處的 N2 吹掃氣源。',
      pr: 'IPA 以鼓泡 (bubbler) 或加熱汽化後與 N2 載氣混合。乾燥原理是 Marangoni 效應：IPA 溶入水膜邊界使該處表面張力下降，形成張力梯度把水拉離晶圓，達成幾乎無殘留的乾燥。相較單純甩乾，可大幅降低 watermark 與圖形倒塌 (pattern collapse)。',
      sp: 'IPA 濃度與 N2 流量需匹配；IPA 為可燃物 (閃點約 12 °C)，需防爆設計、可燃氣體偵測與 N2 惰化。',
      rk: 'IPA 濃度不足造成 watermark、管路凝結滴落造成斑點、可燃氣體偵測失效的公安風險。'
    },
    en: {
      name: 'IPA Vaporizer / N2 Supply Unit',
      fn: 'Produces IPA vapor or an IPA/N2 mixture for the dry step, and feeds N2 purge points across the tool.',
      pr: 'IPA is bubbled or heat-vaporized and mixed with N2 carrier gas. Drying works by the Marangoni effect: IPA dissolving into the water-film boundary lowers surface tension there, and the resulting tension gradient pulls water off the wafer, leaving almost no residue. Compared with spin-off alone it sharply reduces watermarks and pattern collapse.',
      sp: 'IPA concentration must be matched to N2 flow; IPA is flammable (flash point ~12 °C), so explosion-proof design, combustible-gas detection and N2 inerting are required.',
      rk: 'Too little IPA leaving watermarks, condensation in the line dripping and spotting wafers, failed gas detection creating a safety hazard.'
    },
    ja: {
      name: 'IPA 気化 / N2 供給ユニット',
      fn: '乾燥工程用の IPA 蒸気または IPA/N2 混合気を生成し、装置各部の N2 パージ源も供給する。',
      pr: 'IPA をバブリングまたは加熱気化し、N2 キャリアガスと混合する。乾燥原理はマランゴニ効果で、IPA が水膜境界に溶け込んで表面張力を下げ、その張力勾配が水をウェーハから引き離すため、ほぼ無残留で乾燥できる。単純な振り切りに比べウォーターマークやパターン倒れを大幅に低減する。',
      sp: 'IPA 濃度と N2 流量の整合が必要。IPA は可燃物（引火点約 12 °C）のため防爆設計・可燃性ガス検知・N2 不活性化が必須。',
      rk: 'IPA 濃度不足によるウォーターマーク、配管内結露の滴下によるシミ、ガス検知器故障による保安リスク。'
    }
  },
  {
    id: 'drain_manifold', group: 'utility', color: 0x7f8fa6,
    zh: {
      name: '分流排液歧管 (Segregated Drain)',
      fn: '依藥液種類把腔室排出的廢液分流到酸、鹼、有機、含氟或回收管路。',
      pr: '每個腔室杯體底部有多個排液口，配方切換時由氣動閥同步切換杯體高度與排液路徑。分流的目的一是法規與廢水處理需求 (含 HF 廢液需獨立處理)，二是安全 — 酸與鹼、或有機與氧化劑混合會放熱甚至產生危險氣體。切換時序必須與供液重疊，確保沒有殘液混入錯誤管路。',
      sp: '常見 3–4 路分流；管路需有坡度避免積液；排液總管保持負壓與水封。',
      rk: '分流閥誤動作造成廢液混合、排液堵塞造成杯內積液回濺晶圓、水封乾涸使酸氣從排水倒灌。'
    },
    en: {
      name: 'Segregated Drain Manifold',
      fn: 'Routes chamber effluent to acid, alkaline, organic, fluoride or reclaim lines according to the chemistry in use.',
      pr: 'Each cup has several drain ports; when the recipe switches, pneumatic valves change cup height and drain path together. Segregation exists for regulatory and waste-treatment reasons (HF waste needs its own path) and for safety — mixing acid with base, or organics with oxidizers, releases heat and can generate hazardous gas. Switch timing must overlap the dispense so no residue enters the wrong line.',
      sp: 'Commonly 3–4 paths; sloped piping to avoid standing liquid; drain headers kept under negative pressure with traps.',
      rk: 'A misfiring diverter valve mixing wastes, a clogged drain flooding the cup and splashing the wafer, a dried-out trap letting acid fumes back up.'
    },
    ja: {
      name: '分別排液マニホールド',
      fn: 'チャンバーからの廃液を薬液種別ごとに酸・アルカリ・有機・フッ素含有・回収の各系統へ分別する。',
      pr: '各カップ底部に複数の排液口があり、レシピ切替時にエア弁がカップ高さと排液経路を同時に切り替える。分別の目的は、法規と排水処理（HF 含有廃液は専用処理）、そして安全（酸とアルカリ、有機と酸化剤の混合は発熱・有害ガス発生の恐れ）。切替タイミングは供給とオーバーラップさせ、残液が誤った系統に入らないようにする。',
      sp: '一般に3〜4系統。配管は勾配を付けて液溜まりを防ぐ。排液本管は負圧と封水を維持。',
      rk: '切替弁の誤動作による廃液混合、排液詰まりによるカップ内滞留とウェーハへの跳ね返り、封水切れによる酸性ガス逆流。'
    }
  },
  {
    id: 'exhaust_duct', group: 'utility', color: 0x9aa5b1,
    zh: {
      name: '排氣管道 (酸 / 鹼 / 有機分流)',
      fn: '抽走腔室內的藥液霧滴與蒸氣，維持腔內負壓，並依性質送往對應的廠務洗滌塔。',
      pr: '腔室排氣量由風門 (damper) 與壓差計控制。排氣量太小，霧滴回流沉降在晶圓上形成缺陷；太大則會加速液膜蒸發並在高速旋轉時擾亂氣流，造成乾燥不均與顆粒帶入。因此腔室排氣是一個需依步驟動態調整的製程參數，而不是固定值。',
      sp: '各腔室排氣常以 Pa 級壓差監控；含 IPA 的有機排氣須與酸排分流以免公安風險。',
      rk: '風門卡死造成腔室正壓與酸霧外洩、排氣壓差感測器漂移、管道結晶 (如氨鹽) 逐漸堵塞。'
    },
    en: {
      name: 'Exhaust Ducting (Acid / Alkaline / Organic)',
      fn: 'Removes mist and vapor from the chambers, keeps them under negative pressure, and sends each stream to the matching fab scrubber.',
      pr: 'Chamber exhaust is set by dampers under differential-pressure control. Too little exhaust lets mist recirculate and settle on the wafer as defects; too much accelerates film evaporation and disturbs the airflow at high RPM, hurting dry uniformity and pulling in particles. Exhaust is therefore a per-step process parameter, not a fixed setting.',
      sp: 'Chamber exhaust monitored as a few Pa of differential; IPA-bearing organic exhaust must be separated from acid exhaust for safety.',
      rk: 'A stuck damper pressurizing the chamber and venting acid mist, drifting pressure sensors, duct crystallization (e.g. ammonium salts) slowly clogging the path.'
    },
    ja: {
      name: '排気ダクト（酸 / アルカリ / 有機の分別）',
      fn: 'チャンバー内のミストと蒸気を排出して負圧を保ち、性状ごとに対応するスクラバーへ送る。',
      pr: 'チャンバー排気量はダンパと差圧計で制御する。排気が少なすぎるとミストが再循環してウェーハに付着し欠陥となり、多すぎると液膜の蒸発が進み高速回転時の気流も乱れて乾燥不均一やパーティクル巻き込みを招く。したがって排気はステップごとに調整するプロセスパラメータであり固定値ではない。',
      sp: 'チャンバー排気は数 Pa の差圧で監視。IPA を含む有機排気は保安上、酸排気と分離する。',
      rk: 'ダンパ固着によるチャンバー正圧化と酸ミスト漏洩、差圧センサのドリフト、ダクト内の結晶（アンモニウム塩など）による閉塞。'
    }
  },
  {
    id: 'pipe_deck', group: 'utility', color: 0xa0d8ef,
    zh: {
      name: '上層配管層 (Plumbing Deck)',
      fn: '集中配置藥液、DIW、N2、CDA 與訊號線，由上方分配到各腔室。',
      pr: '採「上供下排」原則：供液由上方重力輔助送入，廢液由下方靠重力排出，減少管路死角與積液。所有藥液管以顏色與標籤區分並套二次包覆管 (double containment)，洩漏時導流到承接盤的感測器。管長差會造成各腔室到達時間不同，因此配管長度須盡量對稱 (matched length) 以確保腔室間一致性。',
      sp: '管材 PFA；標示須符合廠內化學品識別規範；管長差異列入腔室 matching 檢查。',
      rk: '管路彎折積氣造成初期流量不穩、標示錯誤導致誤接藥液、二次包覆管積液未被發現。'
    },
    en: {
      name: 'Upper Plumbing Deck',
      fn: 'Consolidates chemical, DIW, N2, CDA and signal lines and distributes them down to each chamber.',
      pr: 'Built on a supply-from-above, drain-from-below principle so gravity assists both directions and dead legs are minimized. Chemical lines are color-coded, labeled and double-contained, with leak sensors in the containment tray. Unequal run lengths give each chamber a different arrival time, so lengths are matched as closely as possible for chamber-to-chamber consistency.',
      sp: 'PFA tubing; labeling must follow the fab chemical identification standard; length mismatch is part of chamber matching checks.',
      rk: 'Air trapped at bends destabilizing initial flow, mislabeling leading to a wrong chemical connection, liquid pooling unnoticed inside secondary containment.'
    },
    ja: {
      name: '上部配管デッキ',
      fn: '薬液・純水・N2・CDA・信号線を集約し、上方から各チャンバーへ分配する。',
      pr: '「上から供給・下から排出」を原則とし、重力を利用してデッドレグと液溜まりを減らす。薬液配管は色分けとラベル表示を行い二重配管とし、漏液は受けパンのセンサへ導く。配管長差は各チャンバーへの到達時間差となるため、長さをできる限り揃えて室間一致性を確保する。',
      sp: '配管材は PFA。表示は工場の薬品識別基準に従う。配管長差はチャンバーマッチング点検の項目。',
      rk: '曲がり部のエア噛みによる初期流量変動、表示誤りによる薬液誤接続、二重配管内の滞留液の見落とし。'
    }
  },
  {
    id: 'control_rack', group: 'control', color: 0x34495e,
    zh: {
      name: '電控機櫃 (PLC / 伺服驅動 / EC)',
      fn: '執行配方時序、驅動所有伺服與閥件、處理連鎖與報警，並透過 SECS/GEM 與 MES 通訊。',
      pr: '典型分層：上層 PLC 或工控機負責配方與序列，中層運動控制卡驅動主軸與機械手，下層 I/O 模組控制氣動閥與讀取感測器。安全連鎖 (E-Stop、門開、洩漏、超溫) 走獨立的安全繼電器或 Safety PLC，不經一般邏輯，確保單一軟體故障無法解除保護。',
      sp: '通訊介面 SECS-II/HSMS；控制週期常見 1–10 ms；櫃內需正壓通風避免酸霧侵入。',
      rk: '電源雜訊造成伺服誤動作、櫃內濕氣造成端子腐蝕、未經核准的參數修改造成製程偏移。'
    },
    en: {
      name: 'Electrical Cabinet (PLC / Servo Drives / EC)',
      fn: 'Runs recipe sequencing, drives every servo and valve, handles interlocks and alarms, and talks to MES over SECS/GEM.',
      pr: 'Typically layered: a PLC or industrial PC handles recipes and sequence, motion cards drive the spindles and robots, and I/O modules switch pneumatic valves and read sensors. Safety interlocks (E-stop, door open, leak, over-temperature) run through dedicated safety relays or a safety PLC rather than ordinary logic, so no single software fault can defeat protection.',
      sp: 'SECS-II/HSMS interface; control cycles typically 1–10 ms; the cabinet is kept under positive pressure to exclude acid mist.',
      rk: 'Electrical noise causing servo faults, humidity corroding terminals, unapproved parameter edits shifting the process.'
    },
    ja: {
      name: '電装盤 (PLC / サーボドライバ / EC)',
      fn: 'レシピシーケンスの実行、全サーボ・バルブの駆動、インターロックとアラーム処理、SECS/GEM による MES 通信を担う。',
      pr: '一般に階層構成で、上位 PLC／産業用 PC がレシピとシーケンス、中位のモーションカードが主軸とロボット、下位 I/O がエア弁制御とセンサ読取を担当する。安全インターロック（非常停止・扉開・漏液・過昇温）は通常ロジックを経由せず専用の安全リレーまたはセーフティ PLC を通し、単一のソフト故障で保護が無効化されないようにする。',
      sp: '通信は SECS-II/HSMS、制御周期は一般に 1〜10 ms、盤内は正圧換気で酸ミストの侵入を防ぐ。',
      rk: '電源ノイズによるサーボ誤動作、盤内湿気による端子腐食、未承認のパラメータ変更によるプロセス変動。'
    }
  },
  {
    id: 'operator_panel', group: 'control', color: 0x1f7ae0,
    zh: {
      name: '操作介面 (GUI / 觸控面板)',
      fn: '提供配方編輯、腔室狀態監視、報警查詢與維護模式操作。',
      pr: '畫面直接反映 PLC 的狀態機：每個腔室以獨立狀態顯示 (Idle / Processing / Alarm / Maintenance)。權限採分級管理 (Operator / Technician / Engineer)，配方修改須留下稽核軌跡 (audit trail)。維護模式會解除部分自動連鎖，因此僅能在 LOTO 與雙人作業規範下使用。',
      sp: '報警須含代碼、時間戳與排除建議；配方變更需 ECN 核准並保留版本。',
      rk: '以高權限帳號長期登入造成誤改、維護模式未復歸即量產、報警被反覆 bypass 掩蓋真因。'
    },
    en: {
      name: 'Operator Interface (GUI / Touch Panel)',
      fn: 'Provides recipe editing, chamber status monitoring, alarm history and maintenance-mode operation.',
      pr: 'The screen mirrors the PLC state machine, showing each chamber independently as Idle / Processing / Alarm / Maintenance. Access is tiered (Operator / Technician / Engineer) and recipe edits leave an audit trail. Maintenance mode defeats some automatic interlocks, so it may only be used under LOTO and two-person rules.',
      sp: 'Alarms should carry a code, timestamp and recovery hint; recipe changes need ECN approval and versioning.',
      rk: 'Staying logged in at high privilege and editing by mistake, running production with maintenance mode still active, repeatedly bypassing an alarm and hiding the root cause.'
    },
    ja: {
      name: '操作インターフェース (GUI / タッチパネル)',
      fn: 'レシピ編集、チャンバー状態監視、アラーム履歴確認、メンテナンスモード操作を提供する。',
      pr: '画面は PLC のステートマシンをそのまま反映し、各チャンバーを Idle / Processing / Alarm / Maintenance として個別表示する。権限は階層管理（オペレータ／テクニシャン／エンジニア）とし、レシピ変更は監査証跡を残す。メンテナンスモードは一部の自動インターロックを解除するため、LOTO と二人作業の規定下でのみ使用する。',
      sp: 'アラームはコード・タイムスタンプ・復旧手順を含むこと。レシピ変更は ECN 承認とバージョン管理が必要。',
      rk: '高権限アカウントでの常時ログインによる誤変更、メンテナンスモード未復帰での量産、アラームの繰返しバイパスによる真因の隠蔽。'
    }
  },
  {
    id: 'tower_light', group: 'control', color: 0xf2c94c,
    zh: {
      name: '三色警示燈 (Signal Tower)',
      fn: '以燈號與蜂鳴即時顯示機台狀態，供現場遠距判讀。',
      pr: '依 SEMI E10 的設備狀態分類對應燈色：綠 = 生產中、黃 = 待料或需人員介入、紅 = 報警停機、閃爍常代表需立即處理。燈號由 PLC 的狀態機直接驅動，是 OEE 統計 (Productive / Standby / Engineering / Down) 的現場對照。',
      sp: '燈色定義須與廠內標準一致；蜂鳴器音量需符合現場噪音規範。',
      rk: '燈色定義各機不同造成誤判、燈泡故障未被發現、蜂鳴被關閉導致報警延誤。'
    },
    en: {
      name: 'Signal Tower (Stack Light)',
      fn: 'Shows tool state at a glance with lamps and a buzzer so the floor can read status from a distance.',
      pr: 'Lamp colors map to SEMI E10 equipment states: green = productive, yellow = needs attention or waiting for material, red = alarm/down, flashing usually meaning immediate action. The PLC state machine drives it directly, making it the shop-floor view of the same data behind OEE (Productive / Standby / Engineering / Down).',
      sp: 'Color definitions must match the fab standard; buzzer volume must meet floor noise rules.',
      rk: 'Inconsistent color definitions between tools causing misreads, a failed lamp going unnoticed, a disabled buzzer delaying alarm response.'
    },
    ja: {
      name: 'シグナルタワー（積層表示灯）',
      fn: 'ランプとブザーで装置状態を即時表示し、現場から遠目でも判別できるようにする。',
      pr: 'ランプ色は SEMI E10 の装置状態分類に対応する（緑＝生産中、黄＝要対応・材料待ち、赤＝アラーム停止、点滅は即時対応が必要）。PLC のステートマシンが直接駆動し、OEE 集計（Productive / Standby / Engineering / Down）の現場表示となる。',
      sp: '色の定義は工場標準に統一すること。ブザー音量は現場の騒音規定に適合させる。',
      rk: '装置ごとの色定義の不統一による誤認、ランプ故障の見逃し、ブザー停止によるアラーム対応遅れ。'
    }
  },
  {
    id: 'leak_tray', group: 'utility', color: 0xe57373,
    zh: {
      name: '洩漏承接盤與液漏感測器',
      fn: '承接任何洩漏的藥液並立即偵測，觸發供液切斷與報警。',
      pr: '承接盤設有坡度導向低點，低點放置導電式或光學式液漏感測器。導電式靠兩極間電阻下降判定；光學式靠液體改變全反射條件判定 (對 DIW 與有機液皆有效)。偵測到洩漏時，安全邏輯立刻關閉該區供液閥、維持排氣、並鎖住門連鎖，屬 SEMI S2 要求的必要安全機能。',
      sp: '需定期以 DIW 做功能測試；感測器安裝高度須低於任何可能積液處。',
      rk: '感測器被結晶附著失效、承接盤排水孔堵塞造成溢流、測試後未擦乾造成誤報警。'
    },
    en: {
      name: 'Containment Tray & Leak Sensors',
      fn: 'Catches any chemical leak and detects it immediately, tripping dispense shutoff and alarms.',
      pr: 'The tray slopes to a low point where a conductive or optical leak sensor sits. Conductive types read the resistance drop between electrodes; optical types detect the change in total internal reflection when liquid wets the tip (works for DIW and organics alike). On detection, the safety logic closes that zone\'s supply valves, keeps exhaust running and locks the door interlocks — a required safety function under SEMI S2.',
      sp: 'Function-test periodically with DIW; sensors must sit below any point where liquid can pool.',
      rk: 'Crystal deposits blinding the sensor, a blocked tray drain overflowing, moisture left after testing causing nuisance alarms.'
    },
    ja: {
      name: '受け皿（防液パン）と漏液センサ',
      fn: '漏れた薬液を受け止めて即座に検知し、供給遮断とアラームを発報する。',
      pr: '受け皿は最低部へ勾配を付け、そこに電極式または光学式の漏液センサを設置する。電極式は電極間抵抗の低下で、光学式は液体による全反射条件の変化で検知する（純水・有機液の双方に有効）。検知時、安全ロジックは該当区画の供給弁を閉じ、排気を維持し、扉インターロックを施錠する。SEMI S2 が要求する必須安全機能。',
      sp: '定期的に純水で機能テストを行う。センサは液が溜まりうる最下点より低く設置する。',
      rk: '結晶付着によるセンサ失効、受け皿排水口の詰まりによる溢流、テスト後の拭き残しによる誤報。'
    }
  }
];

// ---------------------------------------------------------------------------
// Chamber-level components (single spin-clean chamber)
// ---------------------------------------------------------------------------
export const CHAMBER_PARTS = [
  {
    id: 'ch_housing', group: 'chamber_env', color: 0xe3ebf2, shell: true,
    zh: {
      name: '腔室外殼 / 維修門',
      fn: '包覆整個旋轉清洗空間，維持腔內負壓、阻擋噴濺，並提供維修時的存取。',
      pr: '外殼多為 PP、PVDF 或塗覆 PTFE 的不鏽鋼，能同時耐酸 (HF、HCl) 與鹼 (NH4OH)。內壁刻意做成光滑且無死角，讓噴濺液順壁面流下到排液口，而不是乾掉形成結晶。腔內維持負壓，確保門縫氣流向內。',
      sp: '耐化學材質選用須同時考量 HF 與熱 SC-1；內壁粗糙度愈低愈不易積垢。',
      rk: '內壁結晶剝落成為顆粒源、觀察窗霧化影響目視點檢、門封老化造成負壓不足。'
    },
    en: {
      name: 'Chamber Housing / Service Door',
      fn: 'Encloses the spin-clean volume, holds negative pressure, contains splash, and gives access for service.',
      pr: 'Usually PP, PVDF or PTFE-coated stainless so it resists both acids (HF, HCl) and bases (NH4OH). Interior walls are deliberately smooth and free of pockets so splashed liquid runs down to the drain instead of drying into crystals. Negative pressure keeps door-gap airflow inward.',
      sp: 'Material must survive HF and hot SC-1 together; lower wall roughness means less deposit buildup.',
      rk: 'Flaking wall crystals becoming a particle source, a fogged window blocking visual checks, aged seals losing negative pressure.'
    },
    ja: {
      name: 'チャンバー筐体 / メンテ扉',
      fn: '回転洗浄空間を覆い、負圧を保ち、飛散を封じ込め、保守時のアクセスを提供する。',
      pr: '材質は PP、PVDF、PTFE コート SUS などで、酸（HF、HCl）とアルカリ（NH4OH）の双方に耐える。内壁は意図的に平滑で死角のない形状とし、飛散液が乾いて結晶化せず排液口へ流れるようにする。腔内は負圧を保ち、扉隙間の気流を内向きにする。',
      sp: '材質は HF と高温 SC-1 の両立を考慮。内壁粗さが小さいほど付着物が付きにくい。',
      rk: '内壁結晶の剥離によるパーティクル発生、覗き窓の曇りによる目視点検不良、扉シール劣化による負圧不足。'
    }
  },
  {
    id: 'ch_window', group: 'chamber_env', color: 0x9bd1ff,
    zh: {
      name: '搬送閘門 (Shutter) 與觀察窗',
      fn: '晶圓進出時開啟，製程中關閉以維持腔內氣流與隔絕噴濺；觀察窗供目視點檢。',
      pr: '閘門由氣缸驅動，開闔動作與杯體位置、主軸轉速嚴格連鎖：只有在轉速為零、杯體下降到交接位置時才允許開門。關閉後腔室形成受控的氣流路徑 — 頂部下吹、底部排出，使霧滴不會往上漂到搬送區。',
      sp: '開闔時間約 1 s 內以免影響節拍；門封件需耐化學且不掉屑。',
      rk: '閘門氣缸漏氣造成半開、門封磨耗掉屑成顆粒源、連鎖失效造成手臂與旋轉中晶圓碰撞。'
    },
    en: {
      name: 'Transfer Shutter & View Window',
      fn: 'Opens for wafer transfer and closes during process to hold the internal airflow and contain splash; the window allows visual checks.',
      pr: 'A pneumatic cylinder drives the shutter, hard-interlocked with cup position and spindle speed: it may only open at zero RPM with the cup lowered to the transfer position. Once closed the chamber has a controlled flow path — down from the top, out at the bottom — so mist never drifts up into the transfer area.',
      sp: 'Open/close under about 1 s to protect cadence; seals must be chemically resistant and non-shedding.',
      rk: 'A leaking cylinder leaving the shutter half open, shedding seals adding particles, interlock failure letting the arm hit a spinning wafer.'
    },
    ja: {
      name: '搬送シャッタと覗き窓',
      fn: 'ウェーハ搬送時に開き、処理中は閉じて腔内気流を保ち飛散を封じる。窓は目視点検用。',
      pr: 'シャッタはエアシリンダ駆動で、カップ位置と主軸回転数に厳密にインターロックされる。回転数ゼロかつカップが受渡位置まで下降した時のみ開放が許可される。閉時はチャンバー内に上から下への制御された気流が形成され、ミストが搬送部へ上昇しない。',
      sp: '開閉は約1秒以内でタクトに影響させない。シールは耐薬性かつ発塵しないこと。',
      rk: 'シリンダのエア漏れによる半開、シール摩耗による発塵、インターロック不良によるアームと回転中ウェーハの衝突。'
    }
  },
  {
    id: 'spin_chuck', group: 'chamber_core', color: 0x2f80ed,
    zh: {
      name: '旋轉夾盤 (Spin Chuck)',
      fn: '在高速旋轉下穩固夾持晶圓，同時盡量不接觸背面與元件區。',
      pr: '濕製程幾乎都用機械式邊緣夾持而非真空吸盤 — 因為水氣會破壞真空，且背面吸附會留下痕跡並阻礙背面清洗。夾盤本體多為 PEEK、PCTFE 或 SiC，兼顧耐化學與尺寸穩定。旋轉時離心力使爪子自鎖 (自增壓設計)，轉速愈高夾持力愈大，是很優雅的安全設計。',
      sp: '轉速範圍 0–3000 rpm；夾持只接觸晶圓邊緣約 0.5–1 mm；跳動 (runout) 須小以免液膜不均。',
      rk: '夾盤磨耗造成偏心與振動、殘留藥液結晶卡住夾爪、夾持不良在高速時甩飛晶圓 (破片)。'
    },
    en: {
      name: 'Spin Chuck',
      fn: 'Holds the wafer securely at high RPM while touching as little of the backside and device area as possible.',
      pr: 'Wet processes almost always use mechanical edge grip rather than vacuum: moisture breaks vacuum, and backside suction marks the wafer and blocks backside cleaning. The chuck body is PEEK, PCTFE or SiC for chemical and dimensional stability. During rotation, centrifugal force drives the grip pins tighter — a self-energizing design where grip strength rises with speed.',
      sp: 'Speed range 0–3000 rpm; grip contacts only ~0.5–1 mm of wafer edge; runout must stay low or the liquid film goes uneven.',
      rk: 'Worn chuck causing eccentricity and vibration, crystallized residue jamming the pins, a poor grip throwing the wafer at speed (breakage).'
    },
    ja: {
      name: 'スピンチャック',
      fn: '高速回転下でウェーハを確実に保持しつつ、裏面とデバイス領域への接触を最小限にする。',
      pr: 'ウェット工程では真空チャックではなく機械式エッジグリップがほぼ必須。水分で真空が破れるうえ、裏面吸着は痕跡を残し裏面洗浄も妨げるためである。チャック本体は PEEK、PCTFE、SiC などで耐薬性と寸法安定性を両立する。回転時は遠心力で爪が締まる自己増圧構造となり、高速ほど保持力が増す優れた安全設計。',
      sp: '回転数 0〜3000 rpm、保持はウェーハ端 0.5〜1 mm のみ接触、振れ（ランアウト）は液膜均一性のため小さく保つ。',
      rk: 'チャック摩耗による偏心と振動、残液結晶による爪の固着、保持不良による高速時のウェーハ飛散・破損。'
    }
  },
  {
    id: 'chuck_pin', group: 'chamber_core', color: 0xf2994a,
    zh: {
      name: '夾持爪 (Grip Pin) ×6',
      fn: '以最小接觸面積在晶圓邊緣夾住晶圓，並在交接時鬆開。',
      pr: '爪子偏心安裝在小軸上：低速時由連桿或彈簧維持鬆開位置；旋轉後離心配重使爪子向內轉動咬住晶圓邊緣。接觸點通常 3 或 6 個，材質為 PCTFE/PEEK/藍寶石，硬度需低於矽以免刮傷。接觸點的微小磨耗會直接反映為顆粒與偏心，是 PM 重點項目。',
      sp: '接觸高度需對準晶圓厚度中心 (775 µm 的一半)；建議定期量測夾持偏心與更換週期。',
      rk: '爪面磨出溝槽造成顆粒、單一爪未咬合造成偏心振動、爪上結晶造成晶圓邊緣缺口 (chipping)。'
    },
    en: {
      name: 'Grip Pins ×6',
      fn: 'Hold the wafer at its edge with minimal contact area and release it for transfer.',
      pr: 'Each pin is mounted eccentrically on a small shaft: at low speed a linkage or spring holds it open, and once spinning a centrifugal counterweight rotates it inward to bite the wafer edge. Three or six contact points are typical, made of PCTFE, PEEK or sapphire — always softer than silicon so they cannot scratch it. Tiny wear at these points shows up directly as particles and eccentricity, making them a key PM item.',
      sp: 'Contact height must align with the wafer mid-thickness (half of 775 µm); measure grip eccentricity and replace on schedule.',
      rk: 'Grooved pin faces shedding particles, one pin failing to engage and causing imbalance, crystal buildup chipping the wafer edge.'
    },
    ja: {
      name: 'グリップピン ×6',
      fn: '最小接触面積でウェーハ端を保持し、受渡時に解放する。',
      pr: '各ピンは小軸に偏心して取り付けられ、低速時はリンクやばねで開位置を保ち、回転すると遠心錘により内側へ回ってウェーハ端を掴む。接触点は通常3点または6点で、材質は PCTFE、PEEK、サファイアなどシリコンより軟らかいものを選び傷を防ぐ。接触部の微小摩耗はそのままパーティクルと偏心に現れるため、PM の重点項目となる。',
      sp: '接触高さはウェーハ厚（775 µm）の中心に合わせる。保持偏心の定期測定と交換周期の設定を推奨。',
      rk: 'ピン面の溝摩耗による発塵、1本の噛み込み不良による偏心振動、ピン上の結晶によるウェーハ端の欠け。'
    }
  },
  {
    id: 'spindle_motor', group: 'chamber_core', color: 0xeb5757,
    zh: {
      name: '主軸與直驅馬達 (Spindle / DD Motor)',
      fn: '驅動夾盤旋轉，並精準控制每個製程步驟所需的轉速與加減速。',
      pr: '現代機台多採直驅 (direct drive) 無刷馬達，省去皮帶與減速機以降低振動與發塵；編碼器閉迴路控制轉速。主軸常做成中空以讓背面清洗管路通過，並以磁流體或迷宮式密封＋N2 微正壓阻擋藥液沿軸滲入軸承。轉速控制的關鍵在於：液膜厚度約與轉速平方根成反比，甩乾效率則與轉速成正比，因此不同步驟用不同轉速。',
      sp: '轉速 0–3000 rpm、加速度可達數千 rpm/s；軸承需與 N2 密封配合；振動值列入 PM 趨勢監控。',
      rk: '軸承因藥液滲入而鏽蝕異音、編碼器訊號干擾造成轉速跳動、不平衡造成液膜偏移與乾燥不均。'
    },
    en: {
      name: 'Spindle & Direct-Drive Motor',
      fn: 'Rotates the chuck and precisely controls the speed and ramp rate each recipe step needs.',
      pr: 'Modern tools use a direct-drive brushless motor — no belt or gearbox, so less vibration and fewer particles — closed on an encoder. The spindle is usually hollow so backside-rinse plumbing can pass through, and it is sealed by a ferrofluidic or labyrinth seal with N2 overpressure to keep chemistry out of the bearings. The control logic matters: film thickness scales roughly with the inverse square root of RPM while throw-off rate scales with RPM, which is why each step uses a different speed.',
      sp: '0–3000 rpm with ramps of thousands of rpm/s; bearing life depends on the N2 seal; vibration is trended as a PM metric.',
      rk: 'Chemical ingress corroding bearings and causing noise, encoder noise making speed jitter, imbalance skewing the film and drying unevenly.'
    },
    ja: {
      name: '主軸とダイレクトドライブモータ',
      fn: 'チャックを回転させ、各プロセスステップに必要な回転数と加減速を精密に制御する。',
      pr: '近年はベルトや減速機を廃したダイレクトドライブのブラシレスモータが主流で、振動と発塵を抑え、エンコーダ閉ループで回転数を制御する。主軸は裏面洗浄配管を通すため中空構造とし、磁性流体シールやラビリンスシールと N2 微正圧で薬液の軸受侵入を防ぐ。制御の要点は、液膜厚さが回転数の平方根にほぼ反比例し、振り切り効率は回転数に比例することであり、そのためステップごとに回転数を変える。',
      sp: '0〜3000 rpm、加速度は数千 rpm/s。軸受寿命は N2 シールに依存。振動値は PM トレンド監視項目。',
      rk: '薬液侵入による軸受腐食と異音、エンコーダへのノイズによる回転数変動、アンバランスによる液膜の偏りと乾燥ムラ。'
    }
  },
  {
    id: 'wafer', group: 'chamber_core', color: 0xb8c4d0,
    zh: {
      name: '晶圓 (300 mm Wafer)',
      fn: '被清洗的工件；其表面狀態 (親水/疏水)、圖形深寬比會決定配方設計。',
      pr: '清洗的目標是移除顆粒、金屬離子、有機物與自然氧化層，同時不損傷結構。顆粒去除同時依賴化學 (SC-1 微蝕矽表面把顆粒「墊」起來) 與物理 (液流剪應力、兆聲波)。疏水面 (HF last) 容易產生 watermark，因此乾燥策略必須配合表面性質調整。',
      sp: '300 mm、厚度約 775 µm；高深寬比圖形在乾燥時易發生 pattern collapse。',
      rk: '邊緣缺口在高速旋轉下擴展成破片、疏水面殘水造成 watermark、藥液殘留造成後續製程異常。'
    },
    en: {
      name: 'Wafer (300 mm)',
      fn: 'The workpiece being cleaned; its surface state (hydrophilic/hydrophobic) and pattern aspect ratio drive recipe design.',
      pr: 'Cleaning must remove particles, metal ions, organics and native oxide without damaging structures. Particle removal is both chemical (SC-1 slightly etches silicon and undercuts the particle) and physical (flow shear, megasonic energy). A hydrophobic surface after an HF-last step is watermark-prone, so the drying strategy has to follow the surface chemistry.',
      sp: '300 mm, about 775 µm thick; high-aspect-ratio patterns are prone to collapse during drying.',
      rk: 'An edge chip propagating into breakage at speed, residual water on hydrophobic surfaces leaving watermarks, chemical residue disturbing downstream process.'
    },
    ja: {
      name: 'ウェーハ (300 mm)',
      fn: '洗浄対象物。表面状態（親水／疎水）とパターンのアスペクト比がレシピ設計を左右する。',
      pr: '洗浄の目的はパーティクル、金属イオン、有機物、自然酸化膜の除去であり、同時に構造を損傷させないこと。パーティクル除去は化学的作用（SC-1 がシリコン表面を微小エッチしてパーティクルを持ち上げる）と物理的作用（液流のせん断力、メガソニック）の両方に依存する。HF ラスト後の疎水面はウォーターマークが発生しやすいため、乾燥方法を表面性状に合わせる必要がある。',
      sp: '300 mm、厚さ約 775 µm。高アスペクト比パターンは乾燥時に倒れやすい。',
      rk: '端部の欠けが高速回転で割れに進展、疎水面の残水によるウォーターマーク、薬液残留による後工程異常。'
    }
  },
  {
    id: 'back_nozzle', group: 'chamber_disp', color: 0x56ccf2,
    zh: {
      name: '背面清洗噴嘴 (Back-side Nozzle)',
      fn: '由中空主軸中心向晶圓背面噴出 DIW 或藥液，清洗背面與邊緣。',
      pr: '噴出的液體撞到旋轉背面後被離心力甩成薄膜向外流動，覆蓋整個背面並繞過邊緣形成「bevel 清洗」。背面污染會在後續微影造成聚焦誤差 (focus spot)，也會污染製程機台的載台，因此背面清洗在先進製程是必備步驟。可搭配邊緣噴嘴做精準的 bevel etch。',
      sp: '流量通常低於正面 (0.3–1.0 L/min)；背面液不可越過邊緣爬到正面 (依表面張力與轉速控制)。',
      rk: '流量過大使液體翻上正面造成污染、中空軸密封失效造成液體進入軸承、背面殘留造成 chuck 沾污。'
    },
    en: {
      name: 'Backside Rinse Nozzle',
      fn: 'Dispenses DIW or chemistry up the hollow spindle onto the wafer backside to clean the back surface and bevel.',
      pr: 'Liquid striking the rotating backside is flung outward by centrifugal force into a thin film that covers the whole back and wraps the edge, giving a bevel clean. Backside contamination causes focus errors in later lithography and contaminates downstream chucks, so backside cleaning is standard in advanced nodes. An edge nozzle can be added for controlled bevel etch.',
      sp: 'Flow usually lower than the front side (0.3–1.0 L/min); the film must not climb over the edge onto the front — controlled by surface tension and RPM.',
      rk: 'Excess flow wrapping onto the front and contaminating it, hollow-shaft seal failure letting liquid into bearings, backside residue soiling the chuck.'
    },
    ja: {
      name: '裏面洗浄ノズル',
      fn: '中空主軸の中心から純水や薬液をウェーハ裏面へ噴出し、裏面とベベルを洗浄する。',
      pr: '回転する裏面に当たった液は遠心力で外向きの薄膜となり、裏面全体を覆いながら端部を回り込んでベベル洗浄となる。裏面汚染は後のリソグラフィでフォーカス異常を招き、後工程装置のステージも汚すため、先端プロセスでは裏面洗浄が必須である。エッジノズルと併用して精密なベベルエッチも可能。',
      sp: '流量は表面より少なめ（0.3〜1.0 L/min）。液膜が端部を越えて表面へ回り込まないよう表面張力と回転数で制御する。',
      rk: '流量過大による表面への回り込み汚染、中空軸シール不良による軸受への液侵入、裏面残液によるチャック汚染。'
    }
  },
  {
    id: 'chem_arm', group: 'chamber_disp', color: 0x9b51e0,
    zh: {
      name: '藥液擺臂 (Chemical Scan Arm)',
      fn: '搭載藥液噴嘴，在晶圓上方由中心向邊緣來回掃描，讓藥液均勻覆蓋。',
      pr: '單點定點供液時，藥液在中心停留時間長、邊緣短，會造成中心蝕刻多、邊緣少的碗形 (bowl) 分佈。掃描擺臂以馬達控制角速度：在半徑大的區域停留較久 (因為面積正比於 r)，用「停留時間補償」把蝕刻量拉平。擺臂軌跡與速度曲線是調整 WIW (within-wafer) 均勻性的主要旋鈕。',
      sp: '掃描週期常為數秒；臂體為 PTFE/PEEK 包覆；擺臂高度通常距晶圓 5–20 mm。',
      rk: '擺臂軌跡偏移造成均勻性異常、臂上結晶滴落造成缺陷、擺臂馬達背隙造成位置重複性差。'
    },
    en: {
      name: 'Chemical Scan Arm',
      fn: 'Carries the chemical nozzle and sweeps from wafer center to edge and back so the chemistry covers the surface evenly.',
      pr: 'A fixed center dispense leaves liquid dwelling long at the center and briefly at the edge, producing a bowl-shaped etch profile. The scan arm controls angular velocity so it lingers longer over large radii (area grows with r), using dwell-time compensation to flatten the removal. Arm trajectory and speed profile are the main knobs for within-wafer uniformity.',
      sp: 'Scan cycle typically a few seconds; arm is PTFE/PEEK clad; nozzle height usually 5–20 mm above the wafer.',
      rk: 'Trajectory drift wrecking uniformity, crystals on the arm dripping as defects, arm-motor backlash degrading position repeatability.'
    },
    ja: {
      name: '薬液スキャンアーム',
      fn: '薬液ノズルを搭載し、ウェーハ上を中心から端へ往復走査して薬液を均一に行き渡らせる。',
      pr: '中心固定吐出では中心の滞留時間が長く端が短いため、お椀型のエッチ分布になる。スキャンアームは角速度を制御し、面積が半径に比例することを踏まえて外周側に長く滞在させる「滞留時間補正」で除去量を平坦化する。アーム軌跡と速度プロファイルが面内均一性（WIW）の主要な調整パラメータとなる。',
      sp: '走査周期は数秒が一般的。アームは PTFE/PEEK 被覆。ノズル高さはウェーハから 5〜20 mm 程度。',
      rk: '軌跡ずれによる均一性異常、アーム上の結晶落下による欠陥、アームモータのバックラッシによる位置再現性低下。'
    }
  },
  {
    id: 'chem_nozzle', group: 'chamber_disp', color: 0xbb6bd9,
    zh: {
      name: '藥液噴嘴 (Chemical Nozzle)',
      fn: '把混合好的藥液以穩定、無氣泡、無飛濺的方式送到晶圓表面。',
      pr: '噴嘴內部做成漸縮流道，使流動保持層流 (低雷諾數)，避免噴流打散成液滴二次飛濺產生顆粒。出口常設計成「軟著陸」的柱狀流，落點靠近中心再靠離心力攤開成液膜。液膜厚度由流量與轉速決定，太薄會化學品供應不足、太厚則浪費且反應不均。',
      sp: '噴嘴距晶圓 5–20 mm；液柱不可打散；噴嘴出口需定期檢查是否結晶或偏流。',
      rk: '噴嘴堵塞造成偏流、滴液 (dripping) 在等待中滴到晶圓造成 spot、出口結晶改變落點。'
    },
    en: {
      name: 'Chemical Nozzle',
      fn: 'Delivers mixed chemistry to the wafer surface as a stable, bubble-free, splash-free stream.',
      pr: 'The internal passage tapers so flow stays laminar (low Reynolds number) and the jet does not break into droplets that splash back as particles. The outlet produces a soft-landing column that lands near center and spreads into a film by centrifugal force. Film thickness is set by flow and RPM: too thin starves the reaction, too thick wastes chemistry and reacts unevenly.',
      sp: '5–20 mm above the wafer; the stream must not break up; inspect the outlet regularly for crystals or a skewed jet.',
      rk: 'A partially blocked nozzle skewing the stream, dripping during standby spotting the wafer, outlet crystals shifting the landing point.'
    },
    ja: {
      name: '薬液ノズル',
      fn: '混合済み薬液を、安定・無気泡・無飛散でウェーハ表面へ供給する。',
      pr: '内部流路を漸縮形状にして層流（低レイノルズ数）を保ち、噴流が液滴に分裂して二次飛散しパーティクル源になるのを防ぐ。出口は「ソフトランディング」の柱状流とし、中心付近に着液させてから遠心力で液膜に広げる。液膜厚さは流量と回転数で決まり、薄すぎると薬液供給不足、厚すぎると浪費かつ反応が不均一になる。',
      sp: 'ウェーハから 5〜20 mm。液柱は分裂させない。出口の結晶付着や偏流を定期点検する。',
      rk: 'ノズル詰まりによる偏流、待機中の液だれによるスポット欠陥、出口結晶による着液点のずれ。'
    }
  },
  {
    id: 'rinse_arm', group: 'chamber_disp', color: 0x27ae60,
    zh: {
      name: 'DIW / IPA 擺臂',
      fn: '獨立的第二支擺臂，負責純水沖洗與 IPA 乾燥供給，避免與藥液噴嘴交叉污染。',
      pr: '把純水與藥液分開在不同擺臂，是為了避免殘留藥液在下一片晶圓沖洗時被帶出 (carry-over)。IPA 通道常與 N2 共管形成霧化或蒸氣流。此臂在乾燥步驟時會停在晶圓中心上方，隨著水膜邊界向外退縮同步移動，維持 Marangoni 乾燥前緣。',
      sp: 'DIW 流量常 1.0–2.0 L/min；乾燥步驟時擺臂移動速度需與液膜退縮速度匹配。',
      rk: '沖洗不足造成藥液殘留、IPA 管路凝結滴落、擺臂與化學臂干涉碰撞。'
    },
    en: {
      name: 'DIW / IPA Arm',
      fn: 'A second, independent arm for DI water rinse and IPA dry dispense, kept separate from the chemical nozzle to avoid cross-contamination.',
      pr: 'Splitting water and chemistry across separate arms prevents carry-over of residual chemistry into the next wafer\'s rinse. The IPA channel often shares a line with N2 to form a mist or vapor flow. During drying this arm parks above the wafer center and tracks outward with the receding water boundary, holding the Marangoni drying front.',
      sp: 'DIW flow typically 1.0–2.0 L/min; during dry the arm speed must match the film recession rate.',
      rk: 'Insufficient rinse leaving chemistry behind, condensation dripping from the IPA line, arm-to-arm interference or collision.'
    },
    ja: {
      name: '純水 / IPA アーム',
      fn: '純水リンスと IPA 乾燥供給を担う独立した第2アーム。薬液ノズルと分離してクロスコンタミを防ぐ。',
      pr: '純水と薬液を別アームに分けるのは、残留薬液が次のウェーハのリンス時に持ち出される（キャリーオーバー）のを防ぐため。IPA 系統は N2 と共用配管でミストや蒸気流を作ることが多い。乾燥ステップではウェーハ中心上に位置し、後退する水膜境界に合わせて外側へ移動し、マランゴニ乾燥フロントを維持する。',
      sp: '純水流量は一般に 1.0〜2.0 L/min。乾燥時のアーム速度は液膜後退速度に合わせる。',
      rk: 'リンス不足による薬液残留、IPA 配管の結露滴下、アーム同士の干渉・衝突。'
    }
  },
  {
    id: 'two_fluid_nozzle', group: 'chamber_disp', color: 0x00b8a9,
    zh: {
      name: '二流體 / 兆聲波噴嘴',
      fn: '提供物理性去除顆粒的能量，清除單靠化學無法移除的附著顆粒。',
      pr: '二流體噴嘴以高速 N2 把 DIW 霧化成微液滴，液滴撞擊晶圓表面的動量把顆粒打落；兆聲波 (0.8–3 MHz) 則在液膜中產生穩態空蝕與聲流，用微觀液流剪力剝離顆粒。兩者共同的挑戰是「去除力」與「圖形損傷」的權衡 — 能量太高會打倒高深寬比結構。',
      sp: '兆聲波功率密度需依節點與圖形調整；二流體噴嘴需控制液滴粒徑與速度。',
      rk: '能量過高造成 pattern damage、換能器老化使功率漂移、霧化不均造成清洗不一致。'
    },
    en: {
      name: 'Two-Fluid / Megasonic Nozzle',
      fn: 'Supplies physical removal energy for particles that chemistry alone cannot lift.',
      pr: 'A two-fluid nozzle atomizes DIW with high-velocity N2 into fine droplets whose impact momentum knocks particles loose. Megasonic (0.8–3 MHz) instead drives stable cavitation and acoustic streaming in the liquid film, shearing particles off at micro scale. Both share the same trade-off: removal force versus pattern damage — too much energy topples high-aspect-ratio structures.',
      sp: 'Megasonic power density must be tuned per node and pattern; droplet size and velocity are the knobs on the two-fluid side.',
      rk: 'Excess energy damaging patterns, transducer aging drifting the delivered power, uneven atomization giving inconsistent cleaning.'
    },
    ja: {
      name: '二流体 / メガソニックノズル',
      fn: '化学作用だけでは除去できない付着パーティクルに対し、物理的除去エネルギーを与える。',
      pr: '二流体ノズルは高速 N2 で純水を微小液滴に霧化し、その衝突運動量でパーティクルを叩き落とす。メガソニック（0.8〜3 MHz）は液膜中に定常キャビテーションと音響流を生じさせ、微視的なせん断力で剥離する。共通の課題は「除去力」と「パターンダメージ」のトレードオフで、エネルギー過大は高アスペクト比構造を倒す。',
      sp: 'メガソニックの出力密度はノード・パターンごとに調整。二流体側は液滴径と速度が調整因子。',
      rk: 'エネルギー過大によるパターンダメージ、振動子の劣化による出力ドリフト、霧化ムラによる洗浄ばらつき。'
    }
  },
  {
    id: 'cup_assy', group: 'chamber_cup', color: 0x7fb3d5,
    zh: {
      name: '可升降分液杯 (Multi-level Splash Cup)',
      fn: '接住由晶圓甩出的液體，並依步驟切換高度，把不同藥液導向不同排液口。',
      pr: '這是單片式清洗機最巧妙的機構：杯體為多層同心的環狀擋板，由氣缸或伺服把整組上下移動。杯體在某一高度時，晶圓甩出的液流只會打到對應那一層的擋板，並沿該層的溝槽流到專屬排液口。切換高度＝切換廢液分流，完全不需要閥門接觸廢液。杯壁做成傾斜曲面 (常用 lathe 曲線) 使液體順流不回濺。',
      sp: '常見 3–4 段高度；升降時間 < 1 s 以配合配方節拍；杯內壁需定期清洗避免結晶。',
      rk: '升降不到位造成廢液混流、杯內結晶剝落污染晶圓、氣缸速度過快造成液體回濺。'
    },
    en: {
      name: 'Multi-Level Splash Cup (Elevating)',
      fn: 'Catches liquid thrown off the wafer and changes height per step to route each chemistry to its own drain.',
      pr: 'The cleverest mechanism in a single-wafer cleaner: the cup is a nest of concentric annular baffles raised and lowered as one assembly. At a given height, liquid thrown off the wafer can only strike the matching baffle level and runs down its channel to a dedicated drain. Changing height therefore switches waste segregation with no valve ever touching the effluent. The walls are sloped curved surfaces so liquid sheets down without splashing back.',
      sp: 'Typically 3–4 positions; travel under 1 s to fit recipe cadence; interior needs periodic cleaning to prevent crystal buildup.',
      rk: 'Incomplete travel mixing wastes, crystal flakes falling onto the wafer, an over-fast cylinder causing splash-back.'
    },
    ja: {
      name: '昇降式多段カップ（スプラッシュガード）',
      fn: 'ウェーハから振り切られた液を受け止め、ステップごとに高さを変えて薬液ごとの排液口へ導く。',
      pr: '枚葉洗浄装置で最も巧妙な機構。カップは同心の環状バッフルを重ねた構造で、エアシリンダやサーボで一体昇降する。ある高さでは振り切られた液が対応する段のバッフルにのみ当たり、その段の溝を通って専用排液口へ流れる。つまり高さの切替がそのまま廃液分別の切替となり、廃液に触れるバルブが不要になる。壁面は傾斜した曲面（ラス曲線）とし、液が跳ね返らずに流下するようにしている。',
      sp: '一般に3〜4段。昇降時間は1秒未満でレシピタクトに対応。内壁は結晶防止のため定期清掃。',
      rk: '昇降の位置不良による廃液混合、内壁結晶の剥離によるウェーハ汚染、シリンダ速度過大による跳ね返り。'
    }
  },
  {
    id: 'drain_ports', group: 'chamber_cup', color: 0x8d99ae,
    zh: {
      name: '分流排液口 (酸 / 鹼 / 有機 / 回收)',
      fn: '把不同杯層收集到的廢液，各自送往對應的廠務廢水系統或回收系統。',
      pr: '每一層杯體對應一個排液口，並各自接到獨立管路。排液採重力流並保持坡度與水封；水封同時阻止廠務排水管的酸氣倒灌到腔室。部分高價藥液 (如濃 H3PO4、IPA) 會做回收再利用，因此回收路的液體純度不可被 DIW 稀釋，切換時序要求更嚴格。',
      sp: '排液管徑須容納尖峰流量 (含沖洗水)；水封高度需定期確認；回收路須有純度監測。',
      rk: '排液堵塞造成杯內積液、水封乾涸使酸氣倒灌腐蝕腔室、回收液被稀釋造成整批報廢。'
    },
    en: {
      name: 'Segregated Drain Ports (Acid / Base / Organic / Reclaim)',
      fn: 'Send the effluent collected at each cup level to its matching fab waste or reclaim system.',
      pr: 'Each cup level maps to one drain port on its own line. Flow is gravity driven with maintained slope and traps; traps also stop acid fumes in the house drain from backing up into the chamber. Expensive chemistries (concentrated H3PO4, IPA) may be reclaimed, and reclaim purity must not be diluted by rinse water — so the switch timing there is even tighter.',
      sp: 'Drain size must handle peak flow including rinse water; verify trap seal height periodically; reclaim lines need purity monitoring.',
      rk: 'Clogged drains flooding the cup, a dry trap letting acid fumes corrode the chamber, diluted reclaim scrapping a whole batch.'
    },
    ja: {
      name: '分別排液口（酸 / アルカリ / 有機 / 回収）',
      fn: '各カップ段で回収した廃液を、それぞれ対応する工場排水系統または回収系統へ送る。',
      pr: '各段が1つの排液口に対応し、独立配管へつながる。排液は重力流で勾配と封水を維持し、封水は工場排水側の酸性ガスがチャンバーへ逆流するのも防ぐ。高価な薬液（濃 H3PO4、IPA など）は回収再利用する場合があり、回収液が純水で希釈されないよう切替タイミングはより厳密になる。',
      sp: '排液管径はリンス水を含むピーク流量に対応させる。封水高さを定期確認。回収系統には純度監視が必要。',
      rk: '排液詰まりによるカップ内滞留、封水切れによる酸性ガス逆流と腐食、回収液の希釈によるロット廃棄。'
    }
  },
  {
    id: 'exhaust_port', group: 'chamber_cup', color: 0x9aa5b1,
    zh: {
      name: '腔室排氣口與風門',
      fn: '抽走腔內霧滴與蒸氣、維持腔室負壓，並依步驟調整排氣量。',
      pr: '排氣口通常位於杯體外緣下方，與排液口共構但以擋板分離氣液。風門依步驟切換：供藥液時排氣加大以抽走霧滴；高速乾燥時排氣需適度，太強會把顆粒從排氣側捲回、也會讓 IPA 蒸氣濃度不足而失去 Marangoni 效果。這是製程調校常被忽略但影響很大的參數。',
      sp: '以腔室與外部的壓差 (數 Pa 到數十 Pa) 監控；風門位置需納入配方參數。',
      rk: '排氣不足造成霧滴回沉 (defect)、排氣過強造成乾燥不良與 IPA 消耗增加、風門卡死。'
    },
    en: {
      name: 'Chamber Exhaust Port & Damper',
      fn: 'Extracts mist and vapor, holds the chamber negative, and varies exhaust volume by step.',
      pr: 'The exhaust port sits below the outer cup edge, sharing structure with the drain but separated by a baffle that splits gas from liquid. The damper moves per step: higher exhaust while chemistry is dispensing to pull mist away, moderated during high-speed dry, because too much draw entrains particles back in and thins the IPA vapor below what Marangoni drying needs. It is an easily overlooked parameter with a large process effect.',
      sp: 'Monitored as chamber-to-ambient differential (a few to tens of Pa); damper position belongs in the recipe.',
      rk: 'Too little exhaust letting mist settle as defects, too much causing poor dry and higher IPA use, a seized damper.'
    },
    ja: {
      name: 'チャンバー排気口とダンパ',
      fn: '腔内のミストと蒸気を排出し、負圧を維持し、ステップごとに排気量を調整する。',
      pr: '排気口はカップ外周下部にあり、排液口と一体構造だがバッフルで気液を分離する。ダンパはステップごとに動き、薬液吐出中はミスト排出のため排気を強め、高速乾燥時は抑えめにする。排気が強すぎるとパーティクルを巻き戻し、IPA 蒸気濃度も不足してマランゴニ効果が失われるためである。見落とされがちだがプロセスへの影響が大きいパラメータ。',
      sp: '腔内と外部の差圧（数 Pa〜数十 Pa）で監視。ダンパ位置はレシピパラメータに含める。',
      rk: '排気不足によるミスト再付着（欠陥）、排気過大による乾燥不良と IPA 消費増、ダンパ固着。'
    }
  },
  {
    id: 'top_plate', group: 'chamber_env', color: 0xa0d8ef,
    zh: {
      name: '頂蓋下吹板 (N2 / 潔淨氣流)',
      fn: '在晶圓上方形成均勻的向下氣流，抑制霧滴回流並在乾燥時提供低氧、低濕環境。',
      pr: '頂板佈滿細孔或整流網，把 N2 或潔淨空氣整流成均勻下吹流。三個作用：一是壓制腔內霧滴上升；二是在乾燥步驟形成 N2 幕，降低界面水氣分壓加速蒸發；三是對疏水面抑制氧氣造成的再氧化。下吹流量與排氣量必須配對，否則會破壞腔內壓力平衡。',
      sp: 'N2 流量常為數十至上百 L/min；需與排氣量做平衡調校。',
      rk: '孔板局部堵塞造成氣流偏斜使乾燥不均、N2 純度不足帶入水氣、流量過大擾動液膜。'
    },
    en: {
      name: 'Top Down-Flow Plate (N2 / Clean Gas)',
      fn: 'Creates a uniform downward flow above the wafer to suppress mist recirculation and to provide a low-oxygen, low-humidity environment for drying.',
      pr: 'The plate is perforated or screened to straighten N2 or clean air into even down-flow. It does three jobs: it pushes mist down, it forms an N2 blanket during dry that lowers interfacial water vapor pressure and speeds evaporation, and it suppresses re-oxidation of hydrophobic surfaces. Down-flow and exhaust must be balanced or the chamber pressure balance breaks.',
      sp: 'N2 flow commonly tens to a few hundred L/min, balanced against exhaust.',
      rk: 'Locally blocked holes skewing flow and drying unevenly, impure N2 carrying moisture in, excessive flow disturbing the liquid film.'
    },
    ja: {
      name: '天板ダウンフロープレート (N2 / クリーンガス)',
      fn: 'ウェーハ上方に均一な下降気流を作り、ミストの巻き上がりを抑え、乾燥時は低酸素・低湿度環境を与える。',
      pr: '天板は多孔板または整流網で、N2 やクリーンエアを均一な下降流に整流する。役割は3つ。腔内ミストの上昇抑制、乾燥時に N2 ブランケットを形成して界面の水蒸気分圧を下げ蒸発を促進すること、疎水面の再酸化抑制である。ダウンフロー量と排気量は必ず釣り合わせる必要があり、崩れると腔内圧力バランスが乱れる。',
      sp: 'N2 流量は数十〜数百 L/min が一般的。排気量とバランス調整する。',
      rk: '多孔板の部分閉塞による気流偏りと乾燥ムラ、N2 純度不足による水分持込み、流量過大による液膜の乱れ。'
    }
  },
  {
    id: 'lift_pin', group: 'chamber_core', color: 0xf2c94c,
    zh: {
      name: '頂針 / 交接支撐 (Lift Pin)',
      fn: '在搬送手臂與夾盤之間交接晶圓時，暫時把晶圓抬起或托住。',
      pr: '交接時序：手臂伸入 → 頂針上升托起晶圓 → 手臂退出 → 頂針下降把晶圓放到夾盤 → 夾爪咬合。頂針以氣缸或凸輪驅動，末端為 PEEK 或藍寶石，接觸點在晶圓背面外緣的無元件區。若三根頂針不等高，晶圓落下時會滑動偏心，之後高速旋轉就會產生振動。',
      sp: '三點支撐等高差需在數十 µm 內；接觸點材質硬度須低於矽。',
      rk: '頂針高度不一致造成偏心、頂針卡住造成交接失敗破片、頂針殘留藥液污染晶圓背面。'
    },
    en: {
      name: 'Lift Pins / Hand-off Supports',
      fn: 'Temporarily raise or support the wafer during hand-off between the transfer arm and the chuck.',
      pr: 'Hand-off sequence: arm enters, pins rise and take the wafer, arm retracts, pins lower it onto the chuck, grip pins close. Pins are cylinder or cam driven with PEEK or sapphire tips contacting the backside outer edge, outside the device area. If the three pins are not at equal height the wafer slides as it lands and sits eccentric, which then shows up as vibration at high RPM.',
      sp: 'Height match across the three points within tens of µm; tip material must be softer than silicon.',
      rk: 'Unequal pin height causing eccentricity, a stuck pin failing hand-off and breaking the wafer, chemical residue on pins contaminating the backside.'
    },
    ja: {
      name: 'リフトピン / 受渡サポート',
      fn: '搬送アームとチャック間の受渡時に、ウェーハを一時的に持ち上げ支持する。',
      pr: '受渡シーケンスは、アーム進入 → ピン上昇でウェーハを受取り → アーム退避 → ピン下降でチャックへ載置 → グリップ爪が閉じる、の順。ピンはエアシリンダやカムで駆動し、先端は PEEK やサファイアで、裏面外周のデバイス非形成領域に接触する。3本のピン高さが揃っていないと載置時にウェーハが滑って偏心し、高速回転時の振動として現れる。',
      sp: '3点の高さ差は数十 µm 以内。先端材質はシリコンより軟らかいもの。',
      rk: 'ピン高さ不揃いによる偏心、ピン固着による受渡失敗とウェーハ割れ、ピン上の残液による裏面汚染。'
    }
  },
  {
    id: 'ch_sensors', group: 'chamber_sens', color: 0xe74c3c,
    zh: {
      name: '感測器組 (流量 / 溫度 / 液位 / 轉速 / 晶圓在位)',
      fn: '即時監控製程參數並提供連鎖保護，確保配方真的按設定執行。',
      pr: '典型配置：藥液流量計 (超音波或 Coriolis)、出口溫度計 (Pt100 或熱電偶)、杯體液位/排液堵塞偵測、主軸編碼器轉速回授、晶圓在位 (wafer present) 感測。這些訊號一方面做 SPC 資料採集 (每片晶圓留存 trace)，一方面做安全連鎖 — 例如供液時流量未達下限，系統應中止步驟而不是繼續空跑，否則會做出「看似完成但沒清到」的晶圓。',
      sp: '取樣頻率常為 10–100 ms；關鍵參數需設上下限報警並納入 FDC 模型。',
      rk: '感測器漂移未校正造成製程偏移、報警上下限設太寬失去保護意義、trace 資料缺漏無法追溯異常。'
    },
    en: {
      name: 'Sensor Set (Flow / Temp / Level / RPM / Wafer Present)',
      fn: 'Monitors process parameters live and provides interlock protection so the recipe actually runs as written.',
      pr: 'A typical set: chemical flow meters (ultrasonic or Coriolis), outlet temperature (Pt100 or thermocouple), cup level and drain-clog detection, spindle encoder speed feedback, and wafer-present sensing. These feed SPC data collection (a trace kept per wafer) and safety interlocks — for instance, if flow never reaches its low limit during dispense, the step must abort rather than run dry, otherwise you produce wafers that look processed but were never cleaned.',
      sp: 'Sampling typically 10–100 ms; critical parameters need high/low alarms and should feed the FDC model.',
      rk: 'Uncalibrated sensor drift shifting the process, alarm limits set so wide they protect nothing, missing trace data making excursions untraceable.'
    },
    ja: {
      name: 'センサ群（流量 / 温度 / 液位 / 回転数 / ウェーハ在荷）',
      fn: 'プロセスパラメータをリアルタイム監視し、インターロック保護によりレシピ通りの実行を保証する。',
      pr: '代表的構成は、薬液流量計（超音波式・コリオリ式）、出口温度計（Pt100・熱電対）、カップ液位／排液詰まり検知、主軸エンコーダによる回転数フィードバック、ウェーハ在荷センサ。これらは SPC データ収集（1枚ごとのトレース保存）と安全インターロックの双方に用いる。例えば吐出中に流量が下限に達しない場合、ステップは空運転を続けずに中止すべきである。さもないと「処理済みに見えるが洗浄されていない」ウェーハができてしまう。',
      sp: 'サンプリングは一般に 10〜100 ms。重要パラメータは上下限アラームを設定し FDC モデルへ取り込む。',
      rk: '未校正によるセンサドリフトとプロセス変動、上下限が広すぎて保護にならない設定、トレース欠損による異常追跡不能。'
    }
  },
  {
    id: 'nozzle_standby', group: 'chamber_disp', color: 0x6fcf97,
    zh: {
      name: '噴嘴待機杯 (Standby / Pre-dispense Pot)',
      fn: '噴嘴不使用時的停放位置，並在供液前做預噴 (pre-dispense) 與保濕。',
      pr: '兩個關鍵作用：一是「預噴」— 管路內滯留的液體可能已降溫、濃度改變或含氣泡，供液前先噴掉一小段，確保打到晶圓上的是新鮮、到溫的藥液；二是「保濕」— 噴嘴口若乾掉會結晶，待機杯內維持微量 DIW 或蒸氣讓噴嘴口保持濕潤。這是影響首片效應 (first wafer effect) 的關鍵設計。',
      sp: '預噴時間常為 0.5–3 s；待機杯亦接排液；保濕不可讓液體倒吸回噴嘴。',
      rk: '預噴不足造成首片製程偏移、待機杯排液堵塞溢流、保濕失效造成噴嘴結晶堵塞。'
    },
    en: {
      name: 'Nozzle Standby / Pre-Dispense Pot',
      fn: 'Parks the nozzles when idle and provides pre-dispense and tip wetting before each dispense.',
      pr: 'Two key jobs. Pre-dispense: liquid sitting in the line may have cooled, drifted in concentration or trapped air, so a short purge ensures what reaches the wafer is fresh and at temperature. Tip wetting: a nozzle tip left to dry crystallizes, so the pot holds a little DIW or vapor to keep it wet. This is the design detail behind first-wafer-effect control.',
      sp: 'Pre-dispense typically 0.5–3 s; the pot is drained too; wetting must not siphon back into the nozzle.',
      rk: 'Too little pre-dispense shifting the first wafer, a clogged pot drain overflowing, failed wetting crystallizing and blocking the tip.'
    },
    ja: {
      name: 'ノズル待機ポット（プリディスペンス）',
      fn: '未使用時のノズル待機位置であり、吐出前のプリディスペンスと先端の保湿を行う。',
      pr: '役割は2つ。プリディスペンスは、配管内に滞留した液が冷めていたり濃度が変わっていたり気泡を含んでいる可能性があるため、事前に少量を捨ててウェーハには新鮮で所定温度の薬液のみが当たるようにすること。保湿は、ノズル先端が乾くと結晶化するため、ポット内に微量の純水や蒸気を保ち先端を湿らせておくこと。ファーストウェーハ効果を左右する重要な設計である。',
      sp: 'プリディスペンスは 0.5〜3 秒が一般的。ポットにも排液を接続。保湿液がノズルへ逆吸引されないこと。',
      rk: 'プリディスペンス不足による初品のプロセスずれ、ポット排液詰まりによる溢流、保湿失効によるノズル先端の結晶閉塞。'
    }
  },
  {
    id: 'cup_base', group: 'chamber_cup', color: 0x6b7a8f,
    zh: {
      name: '杯體底座與升降機構',
      fn: '支撐整組杯體並提供精準的多段升降定位。',
      pr: '以氣缸配合機械止擋或伺服驅動，達成 3–4 個可重複的高度位置。氣缸方案便宜可靠但位置固定；伺服方案可任意設定高度，方便製程調校。升降需有速度控制 (節流閥或加減速曲線)，避免快速動作在杯內造成液體晃動回濺到晶圓。位置由近接開關或編碼器確認，未到位不得開始供液。',
      sp: '定位重複性 < 1 mm；升降時間通常 0.5–1 s；需有到位訊號連鎖。',
      rk: '導桿磨耗造成杯體傾斜偏擺、到位訊號誤判造成廢液混流、動作過快造成回濺污染。'
    },
    en: {
      name: 'Cup Base & Elevator Mechanism',
      fn: 'Supports the cup assembly and provides accurate multi-position elevation.',
      pr: 'Either a pneumatic cylinder against mechanical stops or a servo drive, giving 3–4 repeatable heights. Cylinders are cheap and reliable but fixed; a servo allows arbitrary heights, which helps process tuning. Motion must be speed controlled (flow restrictor or ramp profile) so fast travel does not slosh liquid in the cup back onto the wafer. Position is confirmed by proximity switches or an encoder, and dispense is blocked until in position.',
      sp: 'Position repeatability < 1 mm; travel typically 0.5–1 s; in-position signal must be interlocked.',
      rk: 'Worn guide rods tilting the cup, a false in-position signal mixing wastes, over-fast motion splashing back onto the wafer.'
    },
    ja: {
      name: 'カップベースと昇降機構',
      fn: 'カップ一式を支持し、多段の高さ位置を正確に決める。',
      pr: 'エアシリンダとメカストッパの組合せ、またはサーボ駆動で、3〜4 段の再現性ある高さを実現する。シリンダ方式は安価で信頼性が高いが位置は固定、サーボ方式は任意高さを設定できプロセス調整に有利。速度制御（絞り弁や加減速プロファイル）を行い、急動作でカップ内の液が揺れてウェーハへ跳ね返らないようにする。位置は近接スイッチやエンコーダで確認し、未到達では吐出を許可しない。',
      sp: '位置再現性 1 mm 未満、昇降時間は通常 0.5〜1 秒、到達信号のインターロックが必要。',
      rk: 'ガイドロッド摩耗によるカップの傾き、到達信号の誤判定による廃液混合、動作過速による跳ね返り汚染。'
    }
  }
];

// ---------------------------------------------------------------------------
// Process recipe steps used by the chamber animation and the flow tab.
//   rpm      : target spin speed
//   arm      : which arm swings in ('chem' | 'rinse' | null)
//   liquid   : stream color (null = no dispense)
//   cup      : cup elevation index (0 = lowest / transfer, 3 = highest)
//   duration : seconds of animation
// ---------------------------------------------------------------------------
export const PROCESS_STEPS = [
  {
    id: 'load', rpm: 0, arm: null, liquid: null, cup: 0, duration: 3, drain: 'none',
    zh: { name: '① 晶圓載入', chem: '—', purpose: '把晶圓從搬送手臂交接到夾盤並確認在位。',
      detail: '閘門開啟，杯體降到最低的交接位置，頂針上升接走手臂上的晶圓，手臂退出後頂針下降把晶圓放上夾盤，夾爪咬合，wafer present 感測器確認在位後閘門關閉。整個過程主軸必須為零速，否則連鎖不放行。' },
    en: { name: '① Wafer Load', chem: '—', purpose: 'Hand the wafer from the transfer arm to the chuck and confirm it is seated.',
      detail: 'The shutter opens, the cup drops to its lowest transfer position, lift pins rise to take the wafer off the arm, the arm retracts, the pins lower it onto the chuck and the grip pins close. Once the wafer-present sensor confirms, the shutter closes. The spindle must be at zero speed throughout or the interlock blocks the move.' },
    ja: { name: '① ウェーハ搬入', chem: '—', purpose: '搬送アームからチャックへウェーハを受け渡し、在荷を確認する。',
      detail: 'シャッタが開き、カップは最下の受渡位置まで下降。リフトピンが上昇してアームからウェーハを受け取り、アーム退避後にピンが下降してチャックへ載置、グリップ爪が閉じる。在荷センサで確認後、シャッタを閉じる。この間、主軸は必ずゼロ速でなければインターロックが動作を許可しない。' }
  },
  {
    id: 'spinup', rpm: 300, arm: null, liquid: null, cup: 1, duration: 2, drain: 'none',
    zh: { name: '② 夾持確認與起轉', chem: '—', purpose: '低速起轉確認夾持正常、無偏心與異常振動。',
      detail: '以 100–300 rpm 低速旋轉數秒，監測主軸電流與振動。若晶圓偏心或某一夾爪未咬合，此時就會出現振動異常並中止配方 — 這比在 1500 rpm 才發現安全得多。同時杯體上升到第一段位置，準備接液。' },
    en: { name: '② Grip Check & Spin-Up', chem: '—', purpose: 'Spin slowly to confirm the grip is sound with no eccentricity or abnormal vibration.',
      detail: 'A few seconds at 100–300 rpm while spindle current and vibration are watched. An eccentric wafer or an unengaged grip pin shows up here and aborts the recipe — far safer than discovering it at 1500 rpm. Meanwhile the cup rises to its first position, ready to catch liquid.' },
    ja: { name: '② 保持確認と起動回転', chem: '—', purpose: '低速回転で保持状態、偏心の有無、異常振動を確認する。',
      detail: '100〜300 rpm で数秒回転させ、主軸電流と振動を監視する。ウェーハの偏心やグリップ爪の噛み込み不良はこの段階で振動異常として現れ、レシピを中止できる。1500 rpm で発覚するよりはるかに安全である。同時にカップは第1段位置まで上昇し、受液に備える。' }
  },
  {
    id: 'sc1', rpm: 500, arm: 'chem', liquid: 0x2f80ed, cup: 2, duration: 6, drain: 'alkaline',
    zh: { name: '③ SC-1 (APM) 清洗', chem: 'NH4OH : H2O2 : H2O (45–70 °C)', purpose: '去除顆粒與有機物污染。',
      detail: 'SC-1 的機制很精巧：H2O2 把矽表面氧化成薄氧化層，NH4OH 再把它輕微蝕刻掉，於是附著在表面的顆粒被「連底一起挖走」(undercut lift-off)；同時鹼性環境讓顆粒與晶圓表面都帶負電而互相排斥，防止再附著。可搭配兆聲波提升物理去除力。代價是矽表面會微量粗糙化，因此比例與時間需權衡。' },
    en: { name: '③ SC-1 (APM) Clean', chem: 'NH4OH : H2O2 : H2O (45–70 °C)', purpose: 'Remove particles and organic contamination.',
      detail: 'The SC-1 mechanism is elegant: H2O2 oxidizes the silicon surface into a thin oxide and NH4OH etches that oxide slightly, so adhered particles are undercut and lifted off with the layer beneath them. At the same time the alkaline environment makes both particles and wafer surface negatively charged so they repel and do not re-deposit. Megasonic can add physical removal. The cost is slight surface roughening, so ratio and time are a trade-off.' },
    ja: { name: '③ SC-1 (APM) 洗浄', chem: 'NH4OH : H2O2 : H2O（45〜70 °C）', purpose: 'パーティクルと有機汚染の除去。',
      detail: 'SC-1 の機構は巧妙で、H2O2 がシリコン表面を酸化して薄い酸化膜を作り、NH4OH がそれを僅かにエッチングするため、付着パーティクルは下地ごと持ち上げられて除去される（アンダーカット・リフトオフ）。同時にアルカリ環境下でパーティクルとウェーハ表面が共に負に帯電して反発し、再付着を防ぐ。メガソニック併用で物理的除去力を高められる。代償としてシリコン表面が微小に粗くなるため、配合比と時間の最適化が必要。' }
  },
  {
    id: 'rinse1', rpm: 800, arm: 'rinse', liquid: 0x56ccf2, cup: 2, duration: 4, drain: 'reclaim',
    zh: { name: '④ DIW 沖洗 (第一次)', chem: 'DIW (18.2 MΩ·cm)', purpose: '把 SC-1 殘液與被剝離的顆粒徹底沖離晶圓。',
      detail: '沖洗不是單純「用水沖」— 它是把邊界層裡的化學品用新鮮純水置換掉的過程。轉速提高可讓液膜變薄、置換更快，但太高會使中心區水量不足。實務上常用「先低速讓水鋪滿、再升速甩除」的兩段式沖洗。沖洗終點可用排液電阻率 (resistivity) 監測判定。' },
    en: { name: '④ DIW Rinse (first)', chem: 'DIW (18.2 MΩ·cm)', purpose: 'Flush SC-1 residue and lifted particles completely off the wafer.',
      detail: 'Rinsing is not just "spraying water" — it is displacement of chemistry in the boundary layer by fresh DI water. Higher RPM thins the film and speeds displacement, but too high starves the center of water. In practice a two-stage rinse is common: low speed to flood the surface, then ramp up to throw off. Rinse endpoint can be judged from drain resistivity.' },
    ja: { name: '④ 純水リンス（1回目）', chem: '純水（18.2 MΩ·cm）', purpose: 'SC-1 の残液と剥離したパーティクルを完全に洗い流す。',
      detail: 'リンスは単に水をかけることではなく、境界層内の薬液を新鮮な純水で置換する過程である。回転数を上げると液膜が薄くなり置換は速くなるが、高すぎると中心部の水量が不足する。実務では「低速で水を行き渡らせ、その後昇速して振り切る」二段リンスがよく使われる。リンス終点は排液の比抵抗で判定できる。' }
  },
  {
    id: 'dhf', rpm: 300, arm: 'chem', liquid: 0xf2c94c, cup: 3, duration: 5, drain: 'fluoride',
    zh: { name: '⑤ DHF / SC-2 清洗', chem: 'DHF (HF:H2O) 或 SC-2 (HCl:H2O2:H2O)', purpose: '去除自然氧化層與金屬離子污染。',
      detail: 'DHF 溶解 SiO2，把 SC-1 步驟生成的化學氧化層連同埋在其中的金屬一併移除，留下氫終端 (H-terminated) 的疏水矽表面；SC-2 則以 HCl 把金屬離子錯合成可溶性氯化物帶走。此步驟後表面轉為疏水，代表後面的沖洗與乾燥策略必須改變 — 疏水面最容易產生 watermark。轉速通常降低以延長藥液停留、節省用量。' },
    en: { name: '⑤ DHF / SC-2 Clean', chem: 'DHF (HF:H2O) or SC-2 (HCl:H2O2:H2O)', purpose: 'Strip native/chemical oxide and remove metallic contamination.',
      detail: 'DHF dissolves SiO2, taking away the chemical oxide grown during SC-1 along with metals buried in it, and leaves a hydrogen-terminated, hydrophobic silicon surface. SC-2 instead uses HCl to complex metal ions into soluble chlorides. After this step the surface is hydrophobic, which changes everything downstream — hydrophobic surfaces are the most watermark-prone. RPM is usually lowered to extend chemical dwell time and save volume.' },
    ja: { name: '⑤ DHF / SC-2 洗浄', chem: 'DHF（HF:H2O）または SC-2（HCl:H2O2:H2O）', purpose: '自然・化学酸化膜の除去と金属汚染の除去。',
      detail: 'DHF は SiO2 を溶解し、SC-1 で生成した化学酸化膜とその中に取り込まれた金属を同時に除去して、水素終端（疎水性）のシリコン表面を残す。SC-2 は HCl により金属イオンを可溶性の塩化物として錯体化し除去する。この工程後は表面が疎水性となり、以降のリンス・乾燥戦略を変える必要がある。疎水面はウォーターマークが最も発生しやすい。薬液滞留時間を延ばし使用量を抑えるため、回転数は通常下げる。' }
  },
  {
    id: 'rinse2', rpm: 1000, arm: 'rinse', liquid: 0x56ccf2, cup: 2, duration: 5, drain: 'reclaim',
    zh: { name: '⑥ DIW 最終沖洗', chem: 'DIW (18.2 MΩ·cm)', purpose: '把所有酸液殘留沖到規格以下，為乾燥做準備。',
      detail: '最終沖洗的品質直接決定乾燥結果。殘留的離子在乾燥時會隨水分蒸發而濃縮，形成可見的 watermark 或霧狀缺陷 (haze)。沖洗需持續到排液電阻率接近進水值。對疏水面而言，水不易鋪展成連續膜，容易形成孤立水珠 — 這正是接下來 IPA 步驟要解決的問題。' },
    en: { name: '⑥ Final DIW Rinse', chem: 'DIW (18.2 MΩ·cm)', purpose: 'Bring acid residue below spec and prepare the surface for drying.',
      detail: 'Final rinse quality directly sets the drying result. Any residual ions concentrate as water evaporates and show up as visible watermarks or haze. Rinse until drain resistivity approaches the incoming value. On a hydrophobic surface water will not spread into a continuous film and tends to bead into isolated droplets — exactly the problem the next IPA step exists to solve.' },
    ja: { name: '⑥ 最終純水リンス', chem: '純水（18.2 MΩ·cm）', purpose: '酸残留を規格以下まで低減し、乾燥に備える。',
      detail: '最終リンスの品質が乾燥結果を直接左右する。残留イオンは乾燥時の水分蒸発とともに濃縮し、目視可能なウォーターマークやヘイズ欠陥となる。排液の比抵抗が供給水に近づくまでリンスを続ける。疎水面では水が連続膜に広がらず孤立した水滴になりやすく、これこそ次の IPA 工程が解決すべき課題である。' }
  },
  {
    id: 'backrinse', rpm: 500, arm: null, liquid: 0x56ccf2, cup: 2, duration: 3, drain: 'reclaim',
    zh: { name: '⑦ 背面 / 邊緣清洗', chem: 'DIW 或稀釋藥液', purpose: '清除背面與 bevel 區的顆粒與藥液殘留。',
      detail: '由中空主軸中心向背面噴出液體，離心力把它攤成薄膜覆蓋整個背面並繞過 bevel。背面污染在後續微影會造成局部離焦，也會沾污每一台後續機台的載台，因此雖然不影響「這一層」的良率，卻是整條產線的污染管控關鍵。流量需控制到液膜不會翻越邊緣爬到正面。' },
    en: { name: '⑦ Backside / Bevel Clean', chem: 'DIW or dilute chemistry', purpose: 'Clear particles and chemical residue from the backside and bevel.',
      detail: 'Liquid is dispensed up the hollow spindle onto the backside, where centrifugal force spreads it into a thin film covering the back and wrapping the bevel. Backside contamination causes local defocus in later lithography and soils every downstream chuck, so even though it does not affect this layer\'s yield it is central to line-wide contamination control. Flow is limited so the film cannot wrap onto the front surface.' },
    ja: { name: '⑦ 裏面 / ベベル洗浄', chem: '純水または希釈薬液', purpose: '裏面とベベル部のパーティクル・薬液残留を除去する。',
      detail: '中空主軸の中心から裏面へ液を噴出し、遠心力で薄膜状に広げて裏面全体とベベル部を覆う。裏面汚染は後のリソグラフィで局所的なデフォーカスを招き、後工程装置のステージも汚染するため、当該層の歩留りには直接影響しなくてもライン全体の汚染管理上は重要である。液膜が端部を越えて表面へ回り込まないよう流量を制限する。' }
  },
  {
    id: 'ipa', rpm: 300, arm: 'rinse', liquid: 0xbb6bd9, cup: 3, duration: 4, drain: 'organic',
    zh: { name: '⑧ IPA 置換 (Marangoni)', chem: 'IPA 蒸氣 / IPA + N2', purpose: '以低表面張力液體置換水膜，實現無殘留乾燥。',
      detail: '這是整個配方中物理最有趣的一步。IPA 的表面張力 (約 21 mN/m) 遠低於水 (約 72 mN/m)。當 IPA 溶入水膜邊緣，該處表面張力下降，形成指向水膜內部的張力梯度，這股 Marangoni 應力主動把水從晶圓表面「拉走」，而不是等它蒸發。因為水是被拉走而非蒸發，溶解在水中的雜質也一併被帶走，不會濃縮成 watermark。對高深寬比圖形，這也大幅降低毛細力造成的 pattern collapse。' },
    en: { name: '⑧ IPA Displacement (Marangoni)', chem: 'IPA vapor / IPA + N2', purpose: 'Replace the water film with a low-surface-tension liquid for residue-free drying.',
      detail: 'Physically the most interesting step in the recipe. IPA\'s surface tension (~21 mN/m) is far below water\'s (~72 mN/m). As IPA dissolves into the edge of the water film, tension drops there and creates a gradient pointing into the film; this Marangoni stress actively pulls water off the surface instead of waiting for evaporation. Because the water is pulled away rather than evaporated, dissolved impurities leave with it and never concentrate into a watermark. For high-aspect-ratio patterns it also greatly reduces capillary-force pattern collapse.' },
    ja: { name: '⑧ IPA 置換（マランゴニ）', chem: 'IPA 蒸気 / IPA + N2', purpose: '低表面張力の液体で水膜を置換し、無残留乾燥を実現する。',
      detail: 'レシピ中で物理的に最も興味深い工程。IPA の表面張力（約 21 mN/m）は水（約 72 mN/m）よりはるかに低い。IPA が水膜の縁に溶け込むとその部分の表面張力が下がり、水膜内部へ向かう張力勾配が生じる。このマランゴニ応力が水を能動的にウェーハ表面から引き剥がすため、蒸発を待つ必要がない。水が蒸発ではなく引き去られるため、溶存不純物も一緒に運び出され濃縮せず、ウォーターマークにならない。高アスペクト比パターンでは毛細管力によるパターン倒れも大幅に低減できる。' }
  },
  {
    id: 'dry', rpm: 2000, arm: null, liquid: null, cup: 1, duration: 5, drain: 'none',
    zh: { name: '⑨ N2 高速甩乾', chem: 'N2 下吹', purpose: '甩除殘餘液體並在低濕環境下完成乾燥。',
      detail: '轉速提升到 1500–2500 rpm，離心力把殘留液膜甩到杯壁；同時頂板持續下吹乾燥 N2，把界面附近的水氣帶走、降低水蒸氣分壓加速蒸發，也抑制疏水面再氧化。甩乾時間不是愈長愈好 — 過度旋轉會讓微量殘留在表面乾涸成斑點，也浪費節拍。實務上以「表面無反光水痕」為終點並固定時間。' },
    en: { name: '⑨ High-Speed N2 Spin Dry', chem: 'N2 down-flow', purpose: 'Throw off remaining liquid and finish drying in a low-humidity environment.',
      detail: 'Speed ramps to 1500–2500 rpm so centrifugal force flings the residual film to the cup wall, while the top plate keeps blowing dry N2 to carry away interfacial moisture, lower vapor pressure and suppress re-oxidation of hydrophobic surfaces. Longer is not better — over-spinning lets trace residue dry into spots and wastes cadence. In practice the endpoint is "no reflective water traces" at a fixed time.' },
    ja: { name: '⑨ N2 高速スピン乾燥', chem: 'N2 ダウンフロー', purpose: '残液を振り切り、低湿度環境で乾燥を完了させる。',
      detail: '回転数を 1500〜2500 rpm まで上げ、遠心力で残留液膜をカップ壁へ飛ばす。同時に天板から乾燥 N2 を吹き続け、界面付近の水分を運び去って水蒸気分圧を下げ蒸発を促し、疎水面の再酸化も抑える。乾燥時間は長ければよいものではなく、回しすぎると微量残留が表面で乾いてシミになり、タクトも浪費する。実務では「反射する水跡がないこと」を終点とし、時間を固定する。' }
  },
  {
    id: 'unload', rpm: 0, arm: null, liquid: null, cup: 0, duration: 3, drain: 'none',
    zh: { name: '⑩ 停轉與卸載', chem: '—', purpose: '停轉、杯體下降、開門，由手臂取出乾燥完成的晶圓。',
      detail: '主軸以受控減速停止 (急停會讓晶圓在夾爪上微滑)，杯體下降到交接位，確認轉速為零後閘門才可開啟。手臂以乾臂取片 — 此時晶圓已乾燥，不可用濕臂以免二次污染。取出後腔室可立即接收下一片，實現連續 pipeline 運轉。' },
    en: { name: '⑩ Spin Down & Unload', chem: '—', purpose: 'Stop rotation, lower the cup, open the shutter and let the robot take the dried wafer.',
      detail: 'The spindle stops on a controlled ramp (a hard stop can let the wafer slip in the grips), the cup drops to the transfer position, and only after zero speed is confirmed may the shutter open. The dry hand picks the wafer — it is dry now, so using the wet hand would re-contaminate it. Once removed, the chamber can accept the next wafer immediately, keeping the pipeline full.' },
    ja: { name: '⑩ 停止と搬出', chem: '—', purpose: '回転停止、カップ下降、シャッタ開放後、アームで乾燥済みウェーハを取り出す。',
      detail: '主軸は制御された減速で停止する（急停止は爪上でウェーハを微小に滑らせる）。カップを受渡位置まで下げ、回転数ゼロを確認して初めてシャッタを開放できる。取出しはドライハンドで行う。ウェーハは乾燥済みのため、ウェットハンドを使うと再汚染となる。搬出後すぐ次のウェーハを受け入れられ、連続パイプライン運転が成立する。' }
  }
];
