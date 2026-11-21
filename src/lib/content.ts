export type Locale = "ar" | "en";
type Translated<T> = Record<Locale, T>;

export const practice = {
  name: { ar: "د. أحمد بخاش", en: "Dr. Ahmad Bakhach" },
  specialty: { ar: "العلاج الفيزيائي", en: "Physiotherapy" },
  siteUrl: process.env.SITE_URL?.trim(),
  phone: process.env.PRACTICE_PHONE?.trim(),
  whatsapp: process.env.PRACTICE_WHATSAPP?.replace(/\D/g, ""),
  mapUrl: process.env.PRACTICE_MAP_URL?.trim(),
  location: { ar: "شارع الزيتون، مبنى الحديقة، بيروت", en: "Olive Street, Garden Building, Beirut" },
  hours: { ar: "الاثنين إلى الجمعة، ٩ صباحاً حتى ٥ مساءً", en: "Monday–Friday, 9 am–5 pm" },
  credentials: { ar: "مثال على المؤهلات: إجازة في العلاج الفيزيائي", en: "Example qualification: Bachelor’s degree in physiotherapy" },
  approved: process.env.SITE_INDEXABLE === "true",
  locationLabel: { ar: "بيروت · موقع تجريبي", en: "Beirut · Demo location" },
};

type ServiceDetail = {
  title: string;
  summary: string;
  intro: string;
  assessment: string;
  preparation: string;
  question: string;
  answer: string;
};

export const services = [
  {
    slug: "back-neck-pain",
    copy: {
      ar: {
        title: "آلام الظهر والرقبة",
        preparation: "فكّر في وضعية أو حركة تزعجك خلال اليوم، وأحضر أي تقارير متوفرة لديك.",
        question: "هل يمكنني التحدّث عن وضعية عملي؟",
        answer: "نعم. صف كيف تجلس أو تقف أثناء العمل ومتى يبدأ الانزعاج.",
        summary: "عندما يصعب عليك الجلوس أو الالتفات أو إنجاز مهامك اليومية.",
        intro: "قد تلاحظ ألم الظهر أو الرقبة عند الجلوس طويلاً، أو عند رفع شيء، أو حين تستدير. هذه التفاصيل تساعد على فهم ما يحدّ من حركتك.",
        assessment: "ناقش متى تشعر بالألم والحركات التي تجدها صعبة، واختر نشاطاً يومياً ترغب في العودة إليه. تساعد هذه المعلومات على تحديد ما ينبغي تقييمه والاتفاق على الخطوة التالية.",
      },
      en: {
        title: "Back and neck pain",
        preparation: "Think of a position or movement that bothers you during the day. Bring relevant reports if you have them.",
        question: "Can we discuss my desk setup?",
        answer: "Yes. Describe how you sit or stand at work and when you start to feel uncomfortable.",
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
        preparation: "دوّن النشاط الذي تودّ العودة إليه وأحضر أي تقرير يتعلّق بالإصابة.",
        question: "هل يجب أن أكون رياضياً محترفاً؟",
        answer: "يمكنك مناقشة نشاط تمارسه للمتعة أيضاً، مثل المشي أو الجري أو اللعب مع الأصدقاء.",
        summary: "تقييم الحركة التي تحتاجها للعودة إلى نشاطك أو رياضتك.",
        intro: "العودة إلى الجري تختلف عن العودة إلى مباراة أو حصة تدريب. يبدأ التقييم بفهم الإصابة، ومتطلبات رياضتك، وما تستطيع فعله حالياً.",
        assessment: "حضّر وصفاً لما حصل وأي تقارير متوفرة. ناقش الحركات التي ترغب في استعادتها والطريقة المناسبة لمراجعة تقدّمك قبل زيادة الحمل.",
      },
      en: {
        title: "Rehabilitation after a sports injury",
        preparation: "Note the activity you want to return to and bring any reports about the injury.",
        question: "Can I discuss a recreational sport?",
        answer: "Yes. A weekend run, a walk, or a match with friends can all be starting points for discussing your goals.",
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
        preparation: "أحضر تعليمات الخروج وأي ملاحظات من الجرّاح حول الحركات المسموح بها.",
        question: "هل نراجع تعليمات الجرّاح في الزيارة؟",
        answer: "نعم. نقرأها معاً ونحدّد الأسئلة التي تحتاج إلى توضيح من الجرّاح.",
        summary: "خطوات تأهيل تراعي تعليمات الجرّاح ومرحلة التعافي.",
        intro: "تختلف الحركة المسموح بها بحسب العملية ومرحلة التعافي. تساعد تعليمات الجرّاح على تحديد ما يمكن تقييمه وأي احتياطات ينبغي مراعاتها.",
        assessment: "أحضر تعليمات الخروج وأي تقارير لديك. ناقش الأنشطة التي تحتاجها في حياتك اليومية وأي قيود حدّدها الجرّاح.",
      },
      en: {
        title: "Rehabilitation after surgery",
        preparation: "Bring your discharge instructions and any movement restrictions from your surgeon.",
        question: "Can we go through my surgeon’s instructions?",
        answer: "Yes. We can read them together and identify anything that needs clarification from your surgical team.",
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
    title: "د. أحمد بخاش | العلاج الفيزيائي وإعادة التأهيل",
    description: "تعرّف على العلاج الفيزيائي مع د. أحمد، واستكشف الحالات وما يمكنك توقّعه في زيارتك الأولى.",
    heroStart: "العلاج الفيزيائي مع",
    heroEnd: "د. أحمد بخاش",
    heroText: "مع د. أحمد، تبدأ الزيارة بفهم ما يصعّب حركتك وما ترغب في استعادته، ثم تحديد الخطوة التالية معاً.",
    prepare: "حضّر لزيارتك الأولى", browse: "استكشف الحالات", book: "اطلب موعداً", another: "كل الحالات",
    servicesKicker: "الحالات الشائعة", servicesTitle: "ما الذي يدفعك لطلب العلاج؟",
    servicesIntro: "اختر الحالة الأقرب لما تواجهه، وتعرّف على ما يمكن مناقشته في التقييم الأول.",
    meet: "تعرّف إلى د. أحمد بخاش", profile: "اقرأ نبذة عن د. أحمد", findClinic: "كيف تصل إلى العيادة؟",
    demo: "نسخة تجريبية", demoNote: "بيانات العيادة والمؤهلات والصور المعروضة أمثلة توضيحية.",
    qualification: "المؤهلات", approach: "كيف يجري التقييم؟", preparation: "ما الذي أحضره معي؟",
    unsure: "لم تجد الحالة الأقرب إليك؟", practical: "تفاصيل الزيارة التجريبية",
    feeLabel: "رسوم التقييم", fee: "٥٠ دولاراً أميركياً", durationLabel: "مدة التقييم", duration: "٤٥ دقيقة",
    findDoor: "الطابق الأرضي، بجوار مدخل الحديقة. المدخل مستوٍ مع الرصيف.",
    access: "علامة قريبة وسهولة الدخول", demoDirections: "اعرض وصف الطريق التجريبي",
    directionsText: "من مدخل الحديقة، اتبع الرصيف حتى الباب الزجاجي في مبنى الحديقة.",
    previewWhatsApp: "معاينة طلب واتساب", previewCall: "معاينة الاتصال", previewMessage: "مثال على الرسالة التي ترسلها للعيادة",
    demoNumber: "رقم توضيحي", samplePhone: "رقم العيادة", confirmation: "يتأكد موعدك عندما تتفق مع د. أحمد على اليوم والساعة.",
    portraitAlt: "صورة توضيحية لمعالج فيزيائي في العيادة", entranceAlt: "تصوّر توضيحي لمدخل العيادة عند مستوى الشارع",
    firstVisitTitle: "ماذا يحدث في الزيارة الأولى؟",
    firstVisitIntro: "أخبر د. أحمد بما تشعر به، وما يصعب عليك فعله اليوم، وما تريد العودة إليه.",
    steps: [
      ["نسمع قصّتك", "متى بدأت المشكلة؟ وما النشاط الذي ترغب في استعادته؟"],
      ["نقيّم حركتك", "نراجع الحركات التي تؤثر في يومك بما يلائم وضعك."],
      ["نتفق على الخطوة التالية", "تناقش مع د. أحمد أهدافك وما يمكن العمل عليه لاحقاً."],
    ],
    questionsTitle: "قبل حجز الموعد",
    questions: [
      ["ماذا أحضر معي؟", "ارتدِ ملابس مريحة للحركة وأحضر أي تقارير أو صور طبية ذات صلة إذا كانت متوفرة لديك."],
      ["كم تستغرق الزيارة الأولى؟", "في هذا المثال، خُصّصت ٤٥ دقيقة للتقييم الأول."],
      ["كيف أتحقّق من تغطية التأمين؟", "اسأل شركة التأمين عن تغطية العلاج الفيزيائي والمستندات المطلوبة قبل طلب الموعد."],
      ["متى يتأكد موعدي؟", "يتأكد الموعد بعد أن يردّ د. أحمد ويحدّد معك اليوم والساعة."],
    ],
    aboutIntro: "أنا أحمد بخاش. في الزيارة الأولى أستمع إلى ما يزعجك وأسألك عن حركة بسيطة تودّ أن تصبح أسهل في يومك.",
    aboutApproach: "بعد التقييم، نناقش ما لاحظناه ونرتّب أولوياتك معاً. أسئلتك وما تريد العودة إليه يساعدان في تحديد الخطوة التالية.",
    contactTitle: "تواصل مع د. أحمد بخاش",
    contactIntro: "لطلب موعد تقييم، تواصل مباشرة مع د. أحمد واتفق معه على وقت يناسبك.",
    contactAddress: "العنوان", contactHours: "ساعات العمل", directions: "افتح الاتجاهات",
    whatsapp: "اطلب موعداً عبر واتساب", call: "اتصل بد. أحمد",
    message: "مرحباً د. أحمد، أرغب في طلب موعد للتقييم الأول.",
    photos: "نسخة تجريبية ببيانات توضيحية وصور مولّدة بالذكاء الاصطناعي.",
    assessment: "ما الذي نناقشه في التقييم؟",
    heroAlt: "صورة توضيحية لتقييم حركة الذراع أثناء جلسة علاج فيزيائي",
    visitAlt: "صورة توضيحية لمناقشة الخطوة التالية خلال زيارة علاج فيزيائي",
  },
  en: {
    nav: { services: "Conditions", about: "About Dr. Ahmad", visit: "First visit", contact: "Contact" },
    navLabel: "Main navigation", menu: "Menu", skip: "Skip to content", home: "Home",
    title: "Dr. Ahmad Bakhach | Physiotherapy and Rehabilitation",
    description: "Explore physiotherapy with Dr. Ahmad, common conditions, and what to expect from your first assessment.",
    heroStart: "Physiotherapy with",
    heroEnd: "Dr. Ahmad Bakhach",
    heroText: "Start with Dr. Ahmad by talking through what makes movement difficult, what you want to get back to, and the next step you can take together.",
    prepare: "Plan your first visit", browse: "Explore conditions", book: "Request an appointment", another: "All conditions",
    servicesKicker: "Common conditions", servicesTitle: "What brings you in?",
    servicesIntro: "Find the concern closest to yours and see what you can discuss at a first assessment.",
    meet: "Meet Dr. Ahmad Bakhach", profile: "Read Dr. Ahmad’s profile", findClinic: "Find the clinic",
    demo: "Demo practice details", demoNote: "Clinic details, qualifications and photography are illustrative.",
    qualification: "Qualifications", approach: "How I approach an assessment", preparation: "What to bring",
    unsure: "Unsure which concern fits?", practical: "Sample visit details",
    feeLabel: "Assessment fee", fee: "US$50", durationLabel: "Assessment length", duration: "45 minutes",
    findDoor: "Ground floor, beside the garden gate. The entrance is level with the pavement.",
    access: "Landmark and access", demoDirections: "View sample directions",
    directionsText: "From the garden gate, follow the pavement to the glass door of the Garden Building.",
    previewWhatsApp: "Preview WhatsApp request", previewCall: "Preview phone call", previewMessage: "Sample message to the clinic",
    demoNumber: "Illustrative number", samplePhone: "Clinic phone", confirmation: "Your appointment is confirmed when you and Dr. Ahmad agree on a day and time.",
    portraitAlt: "Illustrative portrait of a physiotherapist in a clinic", entranceAlt: "Illustrative street-level clinic entrance",
    firstVisitTitle: "What happens at the first visit?",
    firstVisitIntro: "Tell Dr. Ahmad what you feel, what is difficult today, and what you want to get back to.",
    steps: [
      ["Talk through your history", "When did the problem start, and which activity do you want to return to?"],
      ["Assess your movement", "Review the movements that affect your day in a way that suits your situation."],
      ["Agree on a next step", "Discuss your goals and what you can work on next with Dr. Ahmad."],
    ],
    questionsTitle: "Before you book",
    questions: [
      ["What should I bring?", "Wear clothes you can move in and bring any relevant reports or medical images you already have."],
      ["How long is the first visit?", "The sample schedule allows 45 minutes for a first assessment."],
      ["How can I check insurance coverage?", "Ask your insurer whether physiotherapy is covered and which documents they need before you request a visit."],
      ["When is my appointment confirmed?", "Your appointment is confirmed when Dr. Ahmad replies and agrees on a day and time with you."],
    ],
    aboutIntro: "I’m Ahmad Bakhach. At your first visit, I’ll ask what’s been bothering you and which everyday movement you’d like to feel easier.",
    aboutApproach: "After an assessment, we talk through what we noticed and agree on your priorities. Your questions and the activities you want to return to help guide the next step.",
    contactTitle: "Contact Dr. Ahmad Bakhach",
    contactIntro: "To request a first assessment, contact Dr. Ahmad directly to agree on a time.",
    contactAddress: "Address", contactHours: "Opening hours", directions: "Get directions",
    whatsapp: "Request a visit on WhatsApp", call: "Call Dr. Ahmad",
    message: "Hello Dr. Ahmad, I’d like to request a first assessment.",
    photos: "Demo practice information and AI-generated photography.",
    assessment: "What can I discuss at the assessment?",
    heroAlt: "Illustrative image of an arm movement assessment in physiotherapy",
    visitAlt: "Illustrative image of a conversation during a physiotherapy visit",
  },
};
