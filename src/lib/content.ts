export type Locale = "ar" | "en";
type Translated<T> = Record<Locale, T>;

export const practice = {
  name: { ar: "د. أحمد", en: "Dr. Ahmad" },
  specialty: { ar: "العلاج الفيزيائي", en: "Physiotherapy" },
  siteUrl: process.env.SITE_URL?.trim(),
  phone: process.env.PRACTICE_PHONE?.trim(),
  whatsapp: process.env.PRACTICE_WHATSAPP?.replace(/\D/g, ""),
  mapUrl: process.env.PRACTICE_MAP_URL?.trim(),
  location: { ar: "", en: "" },
  hours: { ar: "", en: "" },
  credentials: { ar: "", en: "" },
  approved: process.env.SITE_INDEXABLE === "true",
};

type ServiceDetail = {
  title: string;
  summary: string;
  intro: string;
  assessment: string;
};

export const services = [
  {
    slug: "back-neck-pain",
    copy: {
      ar: {
        title: "آلام الظهر والرقبة",
        summary: "عندما يصعب عليك الجلوس أو الالتفات أو إنجاز مهامك اليومية.",
        intro: "قد تلاحظ ألم الظهر أو الرقبة عند الجلوس طويلاً، أو عند رفع شيء، أو حين تستدير. هذه التفاصيل تساعد على فهم ما يحدّ من حركتك.",
        assessment: "ناقش متى تشعر بالألم والحركات التي تجدها صعبة، واختر نشاطاً يومياً ترغب في العودة إليه. تساعد هذه المعلومات على تحديد ما ينبغي تقييمه والاتفاق على الخطوة التالية.",
      },
      en: {
        title: "Back and neck pain",
        summary: "When sitting, turning, or getting through the day feels harder.",
        intro: "Back or neck pain may be more noticeable after sitting, lifting, or turning. The details of when you feel it can help clarify what is limiting your movement.",
        assessment: "Talk about when you notice pain, what feels difficult, and one everyday activity you want to get back to. These details help guide the assessment and next steps.",
      },
    },
  },
  {
    slug: "sports-rehabilitation",
    copy: {
      ar: {
        title: "التأهيل بعد إصابة رياضية",
        summary: "تقييم الحركة التي تحتاجها للعودة إلى نشاطك أو رياضتك.",
        intro: "العودة إلى الجري تختلف عن العودة إلى مباراة أو حصة تدريب. يبدأ التقييم بفهم الإصابة، ومتطلبات رياضتك، وما تستطيع فعله حالياً.",
        assessment: "حضّر وصفاً لما حصل وأي تقارير متوفرة. ناقش الحركات التي ترغب في استعادتها والطريقة المناسبة لمراجعة تقدّمك قبل زيادة الحمل.",
      },
      en: {
        title: "Sports rehabilitation",
        summary: "Assess the movement you need for your sport or activity.",
        intro: "Returning to running is different from returning to a match or a training session. The assessment begins with your injury, the demands of your sport, and what you can do today.",
        assessment: "Bring any available reports and be ready to describe what happened. Discuss which movements matter most to you and how to review your progress as activity increases.",
      },
    },
  },
  {
    slug: "post-surgery-rehabilitation",
    copy: {
      ar: {
        title: "التأهيل بعد الجراحة",
        summary: "خطوات تأهيل تراعي تعليمات الجرّاح ومرحلة التعافي.",
        intro: "تختلف الحركة المسموح بها بحسب العملية ومرحلة التعافي. تساعد تعليمات الجرّاح على تحديد ما يمكن تقييمه وأي احتياطات ينبغي مراعاتها.",
        assessment: "أحضر تعليمات الخروج وأي تقارير لديك. ناقش الأنشطة التي تحتاجها في حياتك اليومية وأي قيود حدّدها الجرّاح.",
      },
      en: {
        title: "Rehabilitation after surgery",
        summary: "Plan the next steps with your surgeon’s instructions in mind.",
        intro: "Movement restrictions depend on your operation and stage of recovery. Your surgeon’s instructions help guide what can be assessed and which precautions are needed.",
        assessment: "Bring discharge instructions or reports you already have. Talk about the activities you need in daily life and any restrictions your surgeon has set.",
      },
    },
  },
] satisfies { slug: string; copy: Translated<ServiceDetail> }[];

export const content = {
  ar: {
    nav: { services: "الحالات", about: "عن د. أحمد", visit: "الزيارة الأولى", contact: "التواصل" },
    navLabel: "القائمة الرئيسية", menu: "القائمة", skip: "انتقل إلى المحتوى", home: "الصفحة الرئيسية",
    title: "د. أحمد | العلاج الفيزيائي وإعادة التأهيل",
    description: "تعرّف على العلاج الفيزيائي مع د. أحمد، واستكشف الحالات وما يمكنك توقّعه في زيارتك الأولى.",
    heroStart: "علاج فيزيائي",
    heroEnd: "لحركة أسهل.",
    heroText: "مع د. أحمد، تبدأ الزيارة بفهم ما يصعّب حركتك وما ترغب في استعادته، ثم تحديد الخطوة التالية معاً.",
    prepare: "حضّر لزيارتك الأولى", browse: "استكشف الحالات", book: "اطلب موعداً", another: "كل الحالات",
    servicesKicker: "الحالات الشائعة", servicesTitle: "أين تحتاج إلى مساعدة؟",
    servicesIntro: "اختر الحالة الأقرب لما تواجهه، وتعرّف على ما يمكن مناقشته في التقييم الأول.",
    statement: ["تبدأ الخطة", "بفهم", "حركتك."],
    firstVisitTitle: "ماذا يحدث في الزيارة الأولى؟",
    firstVisitIntro: "أخبر د. أحمد بما تشعر به، وما يصعب عليك فعله اليوم، وما تريد العودة إليه.",
    steps: [
      ["نسمع قصّتك", "متى بدأت المشكلة؟ وما النشاط الذي ترغب في استعادته؟"],
      ["نقيّم حركتك", "نراجع الحركات التي تؤثر في يومك بما يلائم وضعك."],
      ["نتفق على الخطوة التالية", "تناقش مع د. أحمد أهدافك وما يمكن العمل عليه لاحقاً."],
    ],
    questionsTitle: "أسئلة قبل الزيارة",
    questions: [
      ["ماذا أحضر معي؟", "ارتدِ ملابس مريحة للحركة وأحضر أي تقارير أو صور طبية ذات صلة إذا كانت متوفرة لديك."],
      ["هل أعرف عدد الجلسات مسبقاً؟", "تُناقش وتيرة الجلسات بعد التقييم الأول بحسب احتياجاتك وأهدافك، وتُراجع مع تقدّمك."],
      ["متى يتأكد موعدي؟", "يتأكد الموعد بعد أن يردّ د. أحمد ويحدّد معك اليوم والساعة."],
    ],
    aboutIntro: "أنا أحمد، أعمل في العلاج الفيزيائي. في الزيارة الأولى أستمع إلى ما يزعجك، وأتعرّف إلى الحركات التي تهمك في حياتك اليومية.",
    aboutApproach: "بعد التقييم، نناقش ما لاحظناه ونرتّب أولوياتك معاً. أسئلتك وما تريد العودة إليه يساعدان في تحديد الخطوة التالية.",
    contactTitle: "تواصل مع د. أحمد",
    contactIntro: "لطلب موعد تقييم، تواصل مباشرة مع د. أحمد واتفق معه على وقت يناسبك.",
    contactPending: "ستظهر معلومات التواصل هنا بعد تأكيدها.",
    contactAddress: "العنوان", contactHours: "ساعات العمل", directions: "افتح الاتجاهات",
    whatsapp: "اطلب موعداً عبر واتساب", call: "اتصل بد. أحمد",
    message: "مرحباً د. أحمد، أرغب في طلب موعد للتقييم الأول.",
    photos: "صور توضيحية مولّدة بالذكاء الاصطناعي.",
    assessment: "ما الذي نناقشه في التقييم؟",
    heroAlt: "صورة توضيحية لتقييم حركة الذراع أثناء جلسة علاج فيزيائي",
    visitAlt: "صورة توضيحية لمناقشة الخطوة التالية خلال زيارة علاج فيزيائي",
  },
  en: {
    nav: { services: "Conditions", about: "About Dr. Ahmad", visit: "First visit", contact: "Contact" },
    navLabel: "Main navigation", menu: "Menu", skip: "Skip to content", home: "Home",
    title: "Dr. Ahmad | Physiotherapy and Rehabilitation",
    description: "Explore physiotherapy with Dr. Ahmad, common conditions, and what to expect from your first assessment.",
    heroStart: "Physiotherapy for",
    heroEnd: "easier movement.",
    heroText: "Start with Dr. Ahmad by talking through what makes movement difficult, what you want to get back to, and the next step you can take together.",
    prepare: "Plan your first visit", browse: "Explore conditions", book: "Request an appointment", another: "All conditions",
    servicesKicker: "Common conditions", servicesTitle: "Where do you need help?",
    servicesIntro: "Find the concern closest to yours and see what you can discuss at a first assessment.",
    statement: ["A plan starts", "with how", "you move."],
    firstVisitTitle: "What happens at the first visit?",
    firstVisitIntro: "Tell Dr. Ahmad what you feel, what is difficult today, and what you want to get back to.",
    steps: [
      ["Talk through your history", "When did the problem start, and which activity do you want to return to?"],
      ["Assess your movement", "Review the movements that affect your day in a way that suits your situation."],
      ["Agree on a next step", "Discuss your goals and what you can work on next with Dr. Ahmad."],
    ],
    questionsTitle: "Questions before your visit",
    questions: [
      ["What should I bring?", "Wear clothes you can move in and bring any relevant reports or medical images you already have."],
      ["Will I know how many visits I need?", "You can discuss the frequency of visits after the first assessment and review it as you progress."],
      ["When is my appointment confirmed?", "Your appointment is confirmed when Dr. Ahmad replies and agrees on a day and time with you."],
    ],
    aboutIntro: "I’m Ahmad, a physiotherapist. At the first visit, I listen to what brings you in and learn which movements matter in your day.",
    aboutApproach: "After an assessment, we talk through what we noticed and agree on your priorities. Your questions and the activities you want to return to help guide the next step.",
    contactTitle: "Contact Dr. Ahmad",
    contactIntro: "To request a first assessment, contact Dr. Ahmad directly to agree on a time.",
    contactPending: "Contact details will appear here once confirmed.",
    contactAddress: "Address", contactHours: "Opening hours", directions: "Get directions",
    whatsapp: "Request a visit on WhatsApp", call: "Call Dr. Ahmad",
    message: "Hello Dr. Ahmad, I’d like to request a first assessment.",
    photos: "AI-generated illustrative photography.",
    assessment: "What can I discuss at the assessment?",
    heroAlt: "Illustrative image of an arm movement assessment in physiotherapy",
    visitAlt: "Illustrative image of a conversation during a physiotherapy visit",
  },
};
