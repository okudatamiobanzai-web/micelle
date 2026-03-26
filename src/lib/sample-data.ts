/**
 * サンプルデータ（開発・デモ用）
 * Supabase 接続後は API 取得に置換
 */

export interface SamplePerson {
  id: string;
  name: string;
  ch: string;
  colorClass: string;
  can: string[];
  gifted: string[];
  completedHelp: number;
  completedReq: number;
  referrals: number;
  milkComment: string | null;
  area: string;
  sns?: Record<string, string>;
  isBusiness?: boolean;
  dots: number;
}

export interface SampleComment {
  user: string;
  ch: string;
  dots: number;
  colorClass: string;
  isMilk?: boolean;
  body: string;
  refId?: string;
  refName?: string;
}

export interface SampleReport {
  helperId: string;
  helperName: string;
  duration: string;
  completedDate: string;
  photos: { desc: string; color: string; icon: string }[];
  posterReport?: { text: string };
  helperReport?: { text: string };
}

export interface SamplePost {
  id: number;
  type: "help" | "skill";
  title: string;
  body: string;
  status: string;
  date: string;
  sortDate: string;
  // Help-specific
  poster?: string;
  posterCh?: string;
  posterDots?: number;
  reward?: string | null;
  tag?: string;
  comments?: SampleComment[];
  report?: SampleReport;
  // Skill-specific
  personId?: string;
  skills?: string[];
  pricing?: string;
  interestedCount?: number;
}

function calcDots(p: { completedHelp: number; referrals: number; gifted: string[] }): number {
  return Math.min(8, p.completedHelp + p.referrals + p.gifted.length);
}

const rawPeople = [
  { id: "tanaka", name: "田中裕子", ch: "田", colorClass: "primary", can: ["デザイン", "保育", "送迎"], gifted: ["丁寧", "また頼みたい", "子ども好き", "センスがいい"], completedHelp: 8, completedReq: 2, referrals: 3, milkComment: "デザインも保育もできる頼れる存在。", area: "東2条", sns: { instagram: "tanaka_yuko" } },
  { id: "yamada", name: "山田太一", ch: "山", colorClass: "primary", can: ["力仕事", "DIY", "除雪"], gifted: ["時間に正確", "黙々と丁寧", "頼りになる"], completedHelp: 5, completedReq: 1, referrals: 1, milkComment: "真面目で体力もある。", area: "西3条" },
  { id: "nakano", name: "中野誠", ch: "中", colorClass: "primary", can: ["不動産", "空き家", "相続相談"], gifted: ["知識が深い", "話しやすい", "信頼できる"], completedHelp: 6, completedReq: 0, referrals: 2, milkComment: "空き家事情に一番詳しい人。", area: "中標津町" },
  { id: "sato", name: "佐藤美咲", ch: "佐", colorClass: "purple", can: ["写真撮影"], gifted: ["センスがいい"], completedHelp: 2, completedReq: 1, referrals: 0, milkComment: null, area: "中標津町" },
  { id: "jfarm", name: "Jファーム", ch: "J", colorClass: "primary", can: ["酪農体験", "撮影受入"], gifted: ["あたたかい", "また行きたい"], completedHelp: 2, completedReq: 3, referrals: 1, milkComment: "信頼できる牧場。", area: "中標津町", isBusiness: true },
];

export const people: SamplePerson[] = rawPeople.map((p) => ({
  ...p,
  dots: calcDots(p),
}));

export const posts: SamplePost[] = [
  { id: 1, type: "help", title: "雪下ろしをお願いしたい", body: "事務所の屋根に雪が溜まっています。半日くらいで終わる量です。", poster: "鈴木ミツコ", posterCh: "鈴", posterDots: 1, reward: "5,000円", tag: "作業", date: "3/18", sortDate: "2026-03-18", status: "open", comments: [{ user: "milk運営", ch: "mi", dots: 6, colorClass: "primary", isMilk: true, body: "山田さんが得意なのでつなぎますね。", refId: "yamada", refName: "山田太一" }] },
  { id: 2, type: "help", title: "空港からホテルまで送ってほしい", body: "3/25に中標津空港着14:00。ホテルトーヨーグランドまで。", poster: "田村（旅行者）", posterCh: "田", posterDots: 0, reward: "実費のみ", tag: "送迎", date: "3/25", sortDate: "2026-03-25", status: "open", comments: [] },
  { id: 3, type: "help", title: "チラシのデザインをお願いしたい", body: "4月のマルシェ用A4チラシ1枚。", poster: "なかしべつ観光協会", posterCh: "な", posterDots: 2, reward: "8,000円", tag: "制作", date: "〜3/25", sortDate: "2026-03-25", status: "open", comments: [{ user: "milk運営", ch: "mi", dots: 6, colorClass: "primary", isMilk: true, body: "田中さん、デザインお得意ですよね。", refId: "tanaka", refName: "田中裕子" }] },
  { id: 4, type: "help", title: "親の空き家をどうすれば", body: "昨年父が亡くなり実家が空き家に。売却か解体か…", poster: "高橋健一", posterCh: "高", posterDots: 0, reward: null, tag: "相談", date: "3/15", sortDate: "2026-03-15", status: "open", comments: [{ user: "milk運営", ch: "mi", dots: 6, colorClass: "primary", isMilk: true, body: "中野さんをつなぎます。", refId: "nakano", refName: "中野誠" }] },
  { id: 8, type: "skill", personId: "tanaka", title: "チラシ・ポスターのデザインできます", body: "印刷物のデザイン全般お受けします。A4チラシなら2〜3日で納品可能。ロゴ制作もご相談ください。", skills: ["デザイン", "チラシ", "ロゴ"], pricing: "要相談（内容により無償〜有償）", date: "3/20", sortDate: "2026-03-20", status: "active", interestedCount: 3, comments: [] },
  { id: 9, type: "skill", personId: "yamada", title: "除雪・力仕事なんでもやります", body: "雪下ろし、草刈り、引っ越しの手伝い、家具の組み立て。半日〜1日で対応できます。道具は自分で持っていきます。", skills: ["除雪", "力仕事", "DIY"], pricing: "時給1,000円〜（内容による）", date: "3/22", sortDate: "2026-03-22", status: "active", interestedCount: 5, comments: [] },
  { id: 10, type: "skill", personId: "nakano", title: "空き家・不動産の相談乗ります", body: "相続した空き家どうしよう？売却？解体？賃貸？20年の経験からアドバイスします。まずは気軽にお話しましょう。", skills: ["不動産", "空き家", "相続"], pricing: "初回相談無料", date: "3/19", sortDate: "2026-03-19", status: "active", interestedCount: 2, comments: [] },
  { id: 11, type: "skill", personId: "sato", title: "写真撮影お手伝いします", body: "イベント記録、商品撮影、家族写真など。データ納品。自然光での撮影が得意です。", skills: ["写真撮影"], pricing: "2時間 3,000円〜", date: "3/23", sortDate: "2026-03-23", status: "active", interestedCount: 1, comments: [] },
  { id: 5, type: "help", title: "PCの初期設定がわからない", body: "Wi-FiとメールとLINEの設定ができない。", poster: "渡辺ハルエ", posterCh: "渡", posterDots: 1, reward: "3,000円", tag: "暮らし", date: "3/20", sortDate: "2026-03-20", status: "resolved", comments: [], report: { helperId: "yamada", helperName: "山田太一", duration: "約2時間", completedDate: "3/21", photos: [{ desc: "箱から出した新品PC", color: "#e8e0d8", icon: "💻" }, { desc: "Wi-Fi接続完了", color: "#EBF4FC", icon: "📶" }, { desc: "LINEでビデオ通話成功", color: "#E8F6F0", icon: "📞" }], posterReport: { text: "山田さん、ありがとうございました。LINEで孫とビデオ通話できました。" }, helperReport: { text: "ハルエさんのお宅に伺いました。" } } },
  { id: 6, type: "help", title: "庭の草刈りをお願いしたい", body: "自宅裏の草が伸び放題。約30㎡。", poster: "田中裕子", posterCh: "田", posterDots: 5, reward: "4,000円", tag: "作業", date: "3/10", sortDate: "2026-03-10", status: "resolved", comments: [], report: { helperId: "yamada", helperName: "山田太一", duration: "約3時間", completedDate: "3/12", photos: [{ desc: "膝丈まで伸びた雑草", color: "#d9d4c0", icon: "🌿" }, { desc: "きれいに完了", color: "#E8F6F0", icon: "✅" }], posterReport: { text: "山田さんにお願いして大正解。裏庭が見違えるほどきれいに。" } } },
  { id: 7, type: "help", title: "ベビーシッターお願いしたい", body: "2歳児の見守り。3/29 14:00〜17:00。", poster: "佐々木あゆみ", posterCh: "佐", posterDots: 1, reward: "時給1,500円", tag: "子ども", date: "3/29", sortDate: "2026-03-29", status: "matched", comments: [{ user: "milk運営", ch: "mi", dots: 6, colorClass: "primary", isMilk: true, body: "田中さんは元保育士です。", refId: "tanaka", refName: "田中裕子" }] },
];

export const resolvedPosts = posts.filter((p) => p.status === "resolved" && p.report);
