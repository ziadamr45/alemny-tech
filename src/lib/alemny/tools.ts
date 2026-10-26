/* ============================================================
   دليل أدوات الذكاء الاصطناعي الموثق ٢٠٢٦
   ============================================================ */

export type ToolCategoryId = "study" | "coding" | "design" | "media";
export type ToolPricing = "free" | "freemium";

export interface ToolCategory {
  id: ToolCategoryId;
  label: string;
  shortLabel: string;
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  { id: "study", label: "المذاكرة والبحث", shortLabel: "المذاكرة والبحث" },
  { id: "coding", label: "البرمجة والأكواد", shortLabel: "البرمجة والأكواد" },
  { id: "design", label: "التصميم والواجهات", shortLabel: "التصميم والواجهات" },
  { id: "media", label: "الفيديو والصوت", shortLabel: "الفيديو والصوت" },
];

export const TOOL_PRICING: { id: ToolPricing; label: string }[] = [
  { id: "free", label: "مجاني بالكامل" },
  { id: "freemium", label: "باقات الطلاب / فريميوم" },
];

export type ToolIcon = "notebook" | "palette" | "video" | "terminal" | "sparkles" | "code" | "chat" | "puzzle";

export interface AITool {
  id: string;
  name: string;
  nameEn: string;
  url: string;
  category: ToolCategoryId;
  pricing: ToolPricing;
  tagline: string;
  features: string[];
  useCase: string;
  icon: ToolIcon;
  keywords: string[];
}

export const AI_TOOLS: AITool[] = [
  {
    id: "notebooklm",
    name: "Gemini Notebook",
    nameEn: "NotebookLM سابقًا",
    url: "https://notebook.google.com/",
    category: "study",
    pricing: "free",
    tagline: "دفترك الذكي الذي يتحدث مع مصادرك — أقوى سلاح مذاكرة مجاني في ٢٠٢٦.",
    features: [
      "رفع حتى ٥٠ مصدرًا مجانًا في دفتر واحد (PDF، روابط، فيديوهات، نصوص)",
      "لوحة الاستوديو Studio لتحويل مصادرك إلى محتوى تعليمي بضغطة زر",
      "اختبارات مخصصة Quizzes مع التلميح المتدرج وشرح سبب كل خطأ",
      "بطاقات تعليمية Flashcards ودورات تفاعلية من ملازمك أنت",
      "ملخص صوتي Audio Overview يحوّل المادة إلى حوار بودكاست مترابط",
      "ملخص فيديو في ٦٠ ثانية لكل مصدر قبل الغوص في التفاصيل",
    ],
    useCase:
      "ارفع ملازم الفصل كاملة قبل الامتحان بأسبوعين، ولّد اختبارًا في كل محاضرة، واستمع للملخص الصوتي في الطريق — مراجعة كاملة دون فتح صفحة واحدة يدويًّا.",
    icon: "notebook",
    keywords: ["notebooklm", "notebook", "دفتر", "مصادر", "flashcards", "بودكاست", "مذاكرة"],
  },
  {
    id: "claude-design",
    name: "Claude Design & Claude Duet",
    nameEn: "Anthropic Labs",
    url: "https://www.anthropic.com/news/claude-design-anthropic-labs",
    category: "design",
    pricing: "freemium",
    tagline: "من فكرة في سطرين إلى واجهة تصميم احترافية — مع وكيل يعمل نيابة عنك استباقيًّا.",
    features: [
      "تحويل عناصر الويب والأفكار إلى واجهات ومخططات تصميم احترافية",
      "مخططات وتدفقات تصميم جاهزة للتسليم للمطورين",
      "وكيل Claude Duet الاستباقي: يراجع عملك ويقترح التحسينات قبل أن تطلب",
      "نظام هوية بصرية متسق عبر كل شاشات المشروع",
      "تصدير نظيف يعمل مباشرة مع أدوات البناء الأمامية",
    ],
    useCase:
      "اكتب «صمّم واجهة تطبيق حجز ملاعب بهوية بنفسجية داكنة» وستحصل على مخططات وشاشات كاملة قابلة للتحويل إلى كود في Cursor خلال دقائق.",
    icon: "palette",
    keywords: ["claude", "design", "تصميم", "واجهات", "anthropic", "duet"],
  },
  {
    id: "ai-studio-veo",
    name: "Google AI Studio & Veo 3.1",
    nameEn: "Veo 3.1",
    url: "https://aistudio.google.com/models/veo-3",
    category: "media",
    pricing: "freemium",
    tagline: "ولّد فيديوهات سينمائية بصوت طبيعي مدمج — وابنِ تطبيقاتك من المتصفح مباشرة.",
    features: [
      "توليد فيديو سينمائي بجودة عالية مع صوت Native Audio مدمج تلقائيًّا",
      "تحكم دقيق في حركة الكاميرا والإضاءة وأسلوب المشهد",
      "بناء تطبيقات ذكاء اصطناعي وتجربتها فورًا من المتصفح دون إعداد",
      "مفاتيح API تجريبية لتضمين النماذج في مشاريعك الخاصة",
      "مكتبة نماذج جوجل الكاملة في مكان واحد (نص، صورة، صوت، فيديو)",
    ],
    useCase:
      "اكتب وصف مشهد «كاميرا تحلّق فوق مدينة عربية عند الغروب بأسلوب سينمائي» مع حوار بالعربية — وستحصل على مقطع كامل بالصوت جاهز للريلز.",
    icon: "video",
    keywords: ["veo", "aistudio", "فيديو", "توليد فيديو", "google", "سينمائي", "video"],
  },
  {
    id: "cursor-agents",
    name: "Cursor AI Cloud Agents",
    nameEn: "Cloud Agents",
    url: "https://cursor.com/product",
    category: "coding",
    pricing: "freemium",
    tagline: "وكلاء برمجة سحابية تكتب وتراجع الكود وتبني مشروعك — حتى من هاتفك.",
    features: [
      "وكلاء سحابية تنفّذ مهام البرمجة في الخلفية بالكامل",
      "كتابة ومراجعة كود عبر Pull Requests مع ملاحظات مفصلة",
      "بناء المشاريع ومتابعتها من المتصفح أو الهاتف أثناء التنقل",
      "فهم سياق المشروع كاملًا (كل الملفات) قبل كل تعديل",
      "تشغيل المهام بالتوازي: وكيل يصلح الأخطاء ووكيل يبني ميزة جديدة",
    ],
    useCase:
      "أرسل للوكيل «ابنِ صفحة تسجيل دخول مع تحقق Google» واتركه يعمل بالخلفية — راجع النتيجة من هاتفك في المواصلات وادمجها بضغطة.",
    icon: "terminal",
    keywords: ["cursor", "agents", "برمجة", "كود", "وكلاء", "ide", "coding"],
  },
  {
    id: "gemini",
    name: "Google Gemini",
    nameEn: "gemini.google.com",
    url: "https://gemini.google.com/",
    category: "study",
    pricing: "freemium",
    tagline: "المساعد الشامل المتصل بعالم جوجل: بحث موثق، وكتب ضخمة، وWorkspace كامل.",
    features: [
      "بحث موثق مع روابط مصادر قابلة للتحقق لكل معلومة",
      "تحليل الكتب والملفات الضخمة بسياق استثنائي في محادثة واحدة",
      "Deep Research يبني تقارير مفصلة متعددة الأقسام بمصادر مرقمة",
      "تكامل مباشر مع Google Workspace: Docs، Gmail، Drive",
      "Live Interface للنقاش الصوتي والبصري المباشر",
    ],
    useCase:
      "اطلب «بحث عميق موثق عن أفضل ممارسات زراعة المياه الزراعية في المناخ الحار» — وستحصل على تقرير كامل بمصادر حية تراجعها بنفسك.",
    icon: "sparkles",
    keywords: ["gemini", "google", "بحث", "موثق", "workspace", "deep research"],
  },
  {
    id: "claude-code",
    name: "Claude Code",
    nameEn: "Advanced Coding Agent",
    url: "https://claude.com/product/claude-code",
    category: "coding",
    pricing: "freemium",
    tagline: "وكيل البرمجة المتقدم الذي يعمل داخل طرفيتك ويفهم مشروعك كما يفهمه مهندسك الأفضل.",
    features: [
      "وكيل برمجة متقدم يعمل داخل الطرفية Terminal مباشرة",
      "فهم الكودباس الكامل والقيود المعمارية قبل أي تعديل",
      "تنفيذ مهام متعددة الخطوات: بحث، تعديل، اختبار، وإصلاح",
      "مراجعة كود بنبرة خبير أول تقترح بدائل أفضل ببرهان",
      "ربط بأدوات المشروع: Git، اختبارات، أدوات النشر",
    ],
    useCase:
      "اكتب في الطرفية «حسّن أداء استعلامات قاعدة البيانات وأضف فهارس مناسبة» — سيستكشف المشروع، يعدّل الملفات، ويشرح كل قرار.",
    icon: "code",
    keywords: ["claude code", "برمجة", "terminal", "وكيل", "developer", "anthropic"],
  },
  {
    id: "chatgpt",
    name: "ChatGPT (OpenAI)",
    nameEn: "OpenAI",
    url: "https://openai.com/products/release-notes/",
    category: "media",
    pricing: "freemium",
    tagline: "الأسرع في المحادثة الصوتية الطبيعية والعصف الذهني اليومي — رفيقك الدائم للأفكار.",
    features: [
      "محادثة صوتية سريعة Advanced Voice بانقطاع طبيعي وتفاعل شبه بشري",
      "عصف ذهني يومي مع ذاكرة تتابع أفكارك عبر الجلسات",
      "GPTs مخصصة تبنيها لسير عملك المتكرر وتشاركها",
      "تحليل صور وملفات وإنشاء صور داخل المحادثة نفسها",
      "Canvas لتحرير النصوص والأكواد الطويلة بجانب المحادثة",
    ],
    useCase:
      "ابدأ يومك بجلسة صوتية ١٠ دقائق: «اقترح ٢٠ فكرة ريلز لقناتي التقنية ورتّبها» — ثم طور أفضل فكرة فورًا في Canvas.",
    icon: "chat",
    keywords: ["chatgpt", "openai", "صوت", "عصف ذهني", "محادثة", "voice"],
  },
  {
    id: "web-importer",
    name: "NotebookLM Web Importer",
    nameEn: "Chrome Extension",
    url: "https://chromewebstore.google.com/detail/notebooklm-web-importer/ijdefdijdmghafocfmmdojfghnpelnfn",
    category: "study",
    pricing: "free",
    tagline: "إضافة كروم التي تنقل أي صفحة ويب أو محاضرة يوتيوب إلى دفترك الذكي بضغطة واحدة.",
    features: [
      "حفظ صفحات الويب كمصادر داخل NotebookLM بضغطة زر",
      "استيراد محاضرات اليوتيوب (النص والفيديو) مباشرة إلى دفترك",
      "دعم الاستيراد الجماعي لعدة تبويبات في جلسة واحدة",
      "تنظيم تلقائي للمصادر المستوردة داخل الدفتر الصحيح",
      "مجانية بالكامل وتعمل مع الدفتر المجاني العادي",
    ],
    useCase:
      "أنت تشاهد شرحًا على يوتيوب؟ اضغط زر الإضافة وسيصبح المحتوى مصدرًا في دفترك — اسأله لاحقًا عن أي تفصيلة وردت في الفيديو.",
    icon: "puzzle",
    keywords: ["importer", "إضافة", "كروم", "chrome", "web importer", "يوتيوب", "استيراد"],
  },
];
