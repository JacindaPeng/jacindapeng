export const styleTags = [
  { key: "甜酷", hot: true },
  { key: "潮流", hot: true },
  { key: "街头", hot: false },
  { key: "Y2K", hot: false },
  { key: "通勤辣", hot: true },
  { key: "学院潮", hot: false },
  { key: "音乐节", hot: false },
  { key: "Clean Fit", hot: false },
];

export const scenes = ["通勤", "约会", "周末出街", "音乐节", "出游", "开学"];

export const products = [
  {
    id: "p-1001",
    name: "甜酷短款皮衣（亮面黑）",
    price: 199,
    tags: ["甜酷", "潮流", "街头"],
    colors: ["亮面黑", "奶油白"],
    sizes: ["S", "M", "L"],
    stock: { online: true, store: true },
  },
  {
    id: "p-1002",
    name: "高腰A字牛仔短裙（复古蓝）",
    price: 129,
    tags: ["Y2K", "甜酷"],
    colors: ["复古蓝", "深灰"],
    sizes: ["S", "M", "L"],
    stock: { online: true, store: true },
  },
  {
    id: "p-1003",
    name: "荧光细节运动背心（黑粉）",
    price: 79,
    tags: ["潮流", "音乐节"],
    colors: ["黑粉", "黑绿"],
    sizes: ["S", "M", "L"],
    stock: { online: true, store: false },
  },
  {
    id: "p-1004",
    name: "通勤辣修身西装外套（炭灰）",
    price: 239,
    tags: ["通勤辣", "Clean Fit"],
    colors: ["炭灰", "米白"],
    sizes: ["S", "M", "L", "XL"],
    stock: { online: true, store: true },
  },
  {
    id: "p-1005",
    name: "厚底老爹鞋（奶白）",
    price: 169,
    tags: ["潮流", "学院潮"],
    colors: ["奶白", "黑白"],
    sizes: ["35", "36", "37", "38", "39"],
    stock: { online: true, store: true },
  },
  {
    id: "p-1006",
    name: "金属感链条包（银）",
    price: 89,
    tags: ["甜酷", "潮流"],
    colors: ["银", "黑"],
    sizes: ["均码"],
    stock: { online: true, store: true },
  },
];

export const outfits = [
  {
    id: "o-2001",
    title: "甜酷但不装，通勤也能辣。",
    scene: "通勤",
    budget: 450,
    tags: ["甜酷", "通勤辣", "潮流"],
    items: ["p-1004", "p-1002", "p-1006"],
    story: [
      "想要上班不费脑，又想保留一点“辣”的锋利感。",
      "用修身西装做骨架，短裙拉高比例，银链条包把甜酷点亮。",
      "不需要夸张配色，靠材质对比就很出片。",
    ],
  },
  {
    id: "o-2002",
    title: "周末出街：黑白酷感 + 荧光一点点。",
    scene: "周末出街",
    budget: 420,
    tags: ["潮流", "街头", "音乐节"],
    items: ["p-1001", "p-1003", "p-1005"],
    story: [
      "黑白是最稳的潮流底盘，荧光细节负责“记忆点”。",
      "短款皮衣把上半身收紧，厚底鞋拉长腿，走路带风。",
      "拍照时只要一个侧身，就会很像杂志封面。",
    ],
  },
  {
    id: "o-2003",
    title: "开学第一周：甜酷学院感，干净又有态度。",
    scene: "开学",
    budget: 390,
    tags: ["学院潮", "甜酷", "Clean Fit"],
    items: ["p-1002", "p-1005", "p-1006"],
    story: [
      "学院感不用乖，关键是“干净”和“比例”。",
      "牛仔短裙配厚底鞋显腿长，链条包加一点金属感就够酷。",
      "适合早八，也适合放学去逛街。",
    ],
  },
];

export const stores = [
  {
    id: "s-3001",
    name: "三福｜上海南京东路店",
    city: "上海",
    distanceKm: 1.2,
    open: true,
    highlights: ["本店限定搭配", "打卡得券", "上新快闪"],
    hasTryOn: true,
    hasStock: true,
  },
  {
    id: "s-3002",
    name: "三福｜上海五角场店",
    city: "上海",
    distanceKm: 3.8,
    open: true,
    highlights: ["店员私藏榜", "学生党专区"],
    hasTryOn: true,
    hasStock: true,
  },
  {
    id: "s-3003",
    name: "三福｜上海静安大悦城店",
    city: "上海",
    distanceKm: 5.4,
    open: false,
    highlights: ["到店解锁限定搭配"],
    hasTryOn: false,
    hasStock: true,
  },
];

