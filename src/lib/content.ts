export type Locale = "ar" | "en";
type Translated<T> = Record<Locale, T>;

export const practice = {
  name: { ar: "د. أحمد بخاش", en: "Dr. Ahmad Bakhach" },
  specialty: { ar: "العلاج الفيزيائي", en: "Physiotherapy" },
  phone: process.env.PRACTICE_PHONE?.trim() || "+96176937274",
  whatsapp: process.env.PRACTICE_WHATSAPP?.replace(/\D/g, "") || "96176937274",
  siteUrl: process.env.SITE_URL?.trim(),
  approved: process.env.SITE_INDEXABLE === "true",
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

export const conditions = [
  {
    slug: "back-neck-pain",
    copy: {
      ar: {
        title: "آلام الظهر والرقبة",
        preparation:
          "فكّر في وضعية أو حركة تزعجك خلال اليوم، وأحضر أي تقارير متوفرة لديك.",
        question: "هل يمكنني التحدّث عن وضعية عملي؟",
        answer: "نعم. صف كيف تجلس أو تقف أثناء العمل ومتى يبدأ الانزعاج.",
        summary: "عندما يصعب عليك الجلوس أو الالتفات أو إنجاز مهامك اليومية.",
        intro:
          "قد تلاحظ ألم الظهر أو الرقبة عند الجلوس طويلاً، أو عند رفع شيء، أو حين تستدير. هذه التفاصيل تساعد على فهم ما يحدّ من حركتك.",
        assessment:
          "ناقش متى تشعر بالألم والحركات التي تجدها صعبة، واختر نشاطاً يومياً ترغب في العودة إليه. تساعد هذه المعلومات على تحديد ما ينبغي تقييمه والاتفاق على الخطوة التالية.",
      },
      en: {
        title: "Back and neck pain",
        preparation:
          "Think of a position or movement that bothers you during the day. Bring relevant reports if you have them.",
        question: "Can we discuss my desk setup?",
        answer:
          "Yes. Describe how you sit or stand at work and when you start to feel uncomfortable.",
        summary:
          "When sitting, turning, or getting through the day feels harder.",
        intro:
          "Back or neck pain may be more noticeable after sitting, lifting, or turning. The details of when you feel it can help clarify what is limiting your movement.",
        assessment:
          "Talk about when you notice pain, what feels difficult, and one everyday activity you want to get back to. These details help guide the assessment and next steps.",
      },
    },
  },
  {
    slug: "sports-rehabilitation",
    copy: {
      ar: {
        title: "التأهيل بعد إصابة رياضية",
        preparation:
          "دوّن النشاط الذي تودّ العودة إليه وأحضر أي تقرير يتعلّق بالإصابة.",
        question: "هل يجب أن أكون رياضياً محترفاً؟",
        answer:
          "يمكنك مناقشة نشاط تمارسه للمتعة أيضاً، مثل المشي أو الجري أو اللعب مع الأصدقاء.",
        summary: "تقييم الحركة التي تحتاجها للعودة إلى نشاطك أو رياضتك.",
        intro:
          "العودة إلى الجري تختلف عن العودة إلى مباراة أو حصة تدريب. يبدأ التقييم بفهم الإصابة، ومتطلبات رياضتك، وما تستطيع فعله حالياً.",
        assessment:
          "حضّر وصفاً لما حصل وأي تقارير متوفرة. ناقش الحركات التي ترغب في استعادتها والطريقة المناسبة لمراجعة تقدّمك قبل زيادة الحمل.",
      },
      en: {
        title: "Rehabilitation after a sports injury",
        preparation:
          "Note the activity you want to return to and bring any reports about the injury.",
        question: "Can I discuss a recreational sport?",
        answer:
          "Yes. A weekend run, a walk, or a match with friends can all be starting points for discussing your goals.",
        summary: "Assess the movement you need for your sport or activity.",
        intro:
          "Returning to running is different from returning to a match or a training session. The assessment begins with your injury, the demands of your sport, and what you can do today.",
        assessment:
          "Bring any available reports and be ready to describe what happened. Discuss which movements matter most to you and how to review your progress as activity increases.",
      },
    },
  },
  {
    slug: "post-surgery-rehabilitation",
    copy: {
      ar: {
        title: "التأهيل بعد الجراحة",
        preparation:
          "أحضر تعليمات الخروج وأي ملاحظات من الجرّاح حول الحركات المسموح بها.",
        question: "هل نراجع تعليمات الجرّاح في الزيارة؟",
        answer:
          "نعم. نقرأها معاً ونحدّد الأسئلة التي تحتاج إلى توضيح من الجرّاح.",
        summary: "خطوات تأهيل تراعي تعليمات الجرّاح ومرحلة التعافي.",
        intro:
          "تختلف الحركة المسموح بها بحسب العملية ومرحلة التعافي. تساعد تعليمات الجرّاح على تحديد ما يمكن تقييمه وأي احتياطات ينبغي مراعاتها.",
        assessment:
          "أحضر تعليمات الخروج وأي تقارير لديك. ناقش الأنشطة التي تحتاجها في حياتك اليومية وأي قيود حدّدها الجرّاح.",
      },
      en: {
        title: "Rehabilitation after surgery",
        preparation:
          "Bring your discharge instructions and any movement restrictions from your surgeon.",
        question: "Can we go through my surgeon’s instructions?",
        answer:
          "Yes. We can read them together and identify anything that needs clarification from your surgical team.",
        summary:
          "Plan the next steps with your surgeon’s instructions in mind.",
        intro:
          "Movement restrictions depend on your operation and stage of recovery. Your surgeon’s instructions help guide what can be assessed and which precautions are needed.",
        assessment:
          "Bring discharge instructions or reports you already have. Talk about the activities you need in daily life and any restrictions your surgeon has set.",
      },
    },
  },
] satisfies { slug: string; copy: Translated<ServiceDetail> }[];

export const treatments = [
  {
    slug: "physiotherapy",
    en: [
      "Physiotherapy session",
      "A one-to-one visit to discuss pain, assess movement and plan the next steps.",
    ],
    ar: [
      "جلسة علاج فيزيائي",
      "جلسة فردية لمناقشة الألم وتقييم الحركة والاتفاق على الخطوة التالية.",
    ],
  },
  {
    slug: "dry-needling",
    en: [
      "Dry needling",
      "Discuss dry needling with Dr. Ahmad and whether it fits your care plan.",
    ],
    ar: [
      "العلاج بالإبر الجافة",
      "ناقش مع د. أحمد العلاج بالإبر الجافة ومدى ملاءمته لخطة رعايتك.",
    ],
  },
  {
    slug: "hijama",
    en: [
      "Hijama",
      "Ask about wet cupping, what a visit involves and what to consider beforehand.",
    ],
    ar: [
      "الحجامة",
      "تعرّف إلى الحجامة الرطبة وما تتضمنه الزيارة وما ينبغي مناقشته قبلها.",
    ],
  },
  {
    slug: "rehabilitation",
    en: [
      "Rehabilitation sessions",
      "Work toward the everyday movements or sporting activities that matter to you.",
    ],
    ar: [
      "جلسات إعادة التأهيل",
      "اعمل على استعادة الحركات اليومية أو الأنشطة الرياضية التي تهمّك.",
    ],
  },
];

export const institutions = [
  { en: "Bluehaven University", ar: "جامعة بلوهيفن" },
  { en: "Bayview Medical Centre", ar: "مركز بايفيو الطبي" },
  { en: "Northshore Institute", ar: "معهد نورثشور" },
  { en: "Cedarline Health Sciences", ar: "سيدرلاين للعلوم الصحية" },
];

export const stats = [
  { value: "126", en: "Sessions", ar: "جلسة" },
  { value: "+12", en: "Happy clients", ar: "عميلاً سعيداً" },
  { value: "9", en: "Certifications", ar: "شهادات" },
  { value: "2", en: "Years of experience", ar: "سنتان من الخبرة" },
];

export const values = [
  {
    ar: { title: "الأمانة", description: "أتحمّل مسؤولية ما أقدّمه لك. قبل أن نبدأ، أوضّح لك ما يشمله العلاج وأقترح فقط ما أملك المعرفة والخبرة لتقديمه." },
    en: { title: "Trust and accountability", description: "I take responsibility for the care I offer. Before we start, I explain what the treatment involves and recommend only work I’m trained to do." },
    quote: "مَنْ تَطَبَّبَ وَلَمْ يُعْلَمْ مِنْهُ طِبٌّ فَهُوَ ضَامِنٌ",
  },
  {
    ar: { title: "الإتقان وطلب العلم المستمر", description: "أراجع ما أتعلمه وأطبّقه بعناية. في كل متابعة، أسألك عمّا تغيّر في يومك لأعرف أين أفادتك الخطة وأين تحتاج إلى تعديل." },
    en: { title: "Excellence and lifelong learning", description: "I keep studying and put what I learn into practice with care. At follow-up visits, I ask what has changed in your daily life so we can decide what to keep or adjust." },
    quote: "ان الله يحب اذا عمل احدكم عملا ان يتقنه",
  },
  {
    ar: { title: "الرحمة والسماحة", description: "أعطيك وقتاً لتصف ما يؤلمك وما يقلقك. وإذا كانت حركة ما صعبة عليك، نتوقّف ونبحث معاً عن خطوة تناسبك." },
    en: { title: "Compassion and gentleness", description: "I give you time to tell me what hurts and what worries you. If a movement feels too difficult, we pause and find a step you feel comfortable taking." },
    quote: "الرَّاحِمُونَ يَرْحَمُهُمُ الرَّحْمَنُ",
  },
  {
    ar: { title: "الصدق والشفافية في التشخيص", description: "أشرح لك ما أظهره التقييم وما بقي غير واضح، بلغة يسهل فهمها. نناقش الخيارات المتاحة وأسباب اقتراحي لكل خطوة قبل أن تقرّر." },
    en: { title: "Honesty and transparency in diagnosis", description: "I explain what the assessment shows and what remains uncertain in plain language. We discuss your options and the reason for each recommendation before you decide." },
  },
  {
    ar: { title: "التواضع والاعتراف بحدود العلم", description: "أؤمن بأن الشفاء بيد الله وحده، وأن عملنا مجرد سبب. أبذل ما في وسعي، وأصارحك حين أحتاج إلى رأي زميل أو حين تكون الإحالة إلى اختصاصي آخر أنسب لك." },
    en: { title: "Humility and the limits of knowledge", description: "I believe healing is in God’s hands and that our work is one means of care. I do my part and tell you when I need a colleague’s opinion or when another specialist is better placed to help." },
  },
];

export const articles = [
  {
    slug: "your-first-session",
    photo: "first-visit",
    en: {
      title: "Getting ready for your first session",
      category: "First visit",
      intro: "A few things to have in mind before you arrive.",
      sections: [
        [
          "Think of one everyday activity",
          "Choose something you want to discuss, such as turning your head while driving or returning to a walk you enjoy. Note when it feels difficult.",
        ],
        [
          "Bring what you already have",
          "Pack relevant reports or scans, wear clothes you can move in and bring a short list of questions. Leave time for a 45–75 minute appointment.",
        ],
      ],
    },
    ar: {
      title: "كيف تستعدّ لجلستك الأولى؟",
      category: "الزيارة الأولى",
      intro: "أمور بسيطة يمكنك تحضيرها قبل الوصول.",
      sections: [
        [
          "فكّر في حركة من يومك",
          "اختر نشاطاً تودّ مناقشته، مثل الالتفات أثناء القيادة أو العودة إلى المشي. دوّن متى يصبح صعباً.",
        ],
        [
          "أحضر ما هو متوفّر لديك",
          "أحضر التقارير أو الصور ذات الصلة، وارتدِ ملابس مريحة للحركة. اكتب أسئلتك وخصّص للموعد ما بين ٤٥ و٧٥ دقيقة.",
        ],
      ],
    },
  },
  {
    slug: "talking-about-your-sport",
    photo: "movement-assessment",
    en: {
      title: "Tell your physiotherapist about your sport",
      category: "Sports rehabilitation",
      intro: "Make your next session specific to the activity you miss.",
      sections: [
        [
          "Describe a normal week",
          "Tell Dr. Ahmad what you play, how often you train and which movements your sport involves. Describe a particular moment when the problem gets in the way.",
        ],
        [
          "Bring a goal to the conversation",
          "A goal might be joining a weekend game or getting through a training session comfortably. Ask how you and Dr. Ahmad will review your progress together.",
        ],
      ],
    },
    ar: {
      title: "كيف تتحدّث عن رياضتك مع المعالج؟",
      category: "التأهيل الرياضي",
      intro: "اجعل نقاشك في الجلسة مرتبطاً بالنشاط الذي تفتقده.",
      sections: [
        [
          "صف أسبوعك المعتاد",
          "أخبر د. أحمد بالرياضة التي تمارسها وعدد التدريبات والحركات المطلوبة فيها. صف موقفاً محدداً تعيقك فيه المشكلة.",
        ],
        [
          "حدّد هدفاً للنقاش",
          "قد يكون هدفك المشاركة في مباراة ودّية أو إكمال التمرين براحة. اسأل كيف ستراجعان التقدّم معاً.",
        ],
      ],
    },
  },
  {
    slug: "arranging-a-home-visit",
    photo: "demo-entrance",
    en: {
      title: "Arranging a home physiotherapy visit",
      category: "Home care",
      intro: "What to share when you enquire about a visit at home in Lebanon.",
      sections: [
        [
          "Start with your location",
          "Call or message the clinic with your area, availability and the reason for your visit. Ask Dr. Ahmad to confirm coverage, fees and a time before making arrangements.",
        ],
        [
          "Make arrival straightforward",
          "Mention the floor, lift access and a nearby landmark. Ask what space is needed for the assessment and whether to have any reports ready.",
        ],
      ],
    },
    ar: {
      title: "ترتيب زيارة علاج فيزيائي منزلية",
      category: "الرعاية المنزلية",
      intro: "ما يمكنك مشاركته عند الاستفسار عن زيارة منزلية في لبنان.",
      sections: [
        [
          "ابدأ بموقعك",
          "أخبر العيادة بمنطقتك والأوقات التي تناسبك وسبب الزيارة. تأكّد مع د. أحمد من التغطية الجغرافية والرسوم والموعد.",
        ],
        [
          "سهّل الوصول",
          "اذكر الطابق وتوفّر المصعد وعلامة قريبة. اسأل عن المساحة اللازمة للتقييم والتقارير التي يمكنك تجهيزها.",
        ],
      ],
    },
  },
] as const;

export const content = {
  en: {
    title: "Dr. Ahmad Bakhach | Physiotherapy in Lebanon",
    description:
      "Sports physiotherapy, rehabilitation and home care with Dr. Ahmad Bakhach in Lebanon.",
    home: "Home",
    about: "About me",
    values: "My values",
    services: "Services",
    articles: "Articles",
    faq: "FAQ",
    contact: "Contact",
    skip: "Skip to content",
    menu: "Menu",
    heroLine: "The caring hands you deserve.",
    book: "Book a session",
    specialty: "Physiotherapy in Lebanon",
    certifications: "Certifications",
    demoLogos: "Illustrative institution logos",
    hello: "Hi, I’m Ahmad Bakhach",
    bio: "I’m a compassionate physiotherapist specializing in sports physiotherapy and athlete rehabilitation. I also provide home care for patients in Lebanon.",
    approach: "How we work together",
    approachText:
      "At our first session, we talk through your history and the activities you want to return to. We assess movement together and agree on a plan that fits your goals.",
    numbers: "The practice in numbers",
    testimonials: "Client testimonials",
    sampleQuotes: "Illustrative patient stories",
    quotes: [
      [
        "I came in wanting to get back to weekend football. It helped to have that specific goal at the centre of our conversation.",
        "Sports rehabilitation",
      ],
      [
        "Being able to discuss care at home made it easier for our family to plan the visit.",
        "Home care",
      ],
    ],
    learn: "Learn more",
    featured: "Featured articles",
    allArticles: "See all articles",
    questions: "Frequently asked questions",
    priority: "Prioritize your health",
    chat: "Chat on WhatsApp",
    call: "Call the clinic",
    policy: "Cancellation policy",
    policyText:
      "To cancel or postpone a session, call or message the clinic with your appointment date and time. Ask the clinic to confirm the change and any notice period or fees that apply to your booking.",
    faqItems: [
      [
        "What services does the clinic offer?",
        "The clinic offers musculoskeletal and neurological rehabilitation, sports injury rehabilitation, pain and stress management, dry needling and wet cupping therapy in Lebanon.",
      ],
      [
        "How can I schedule a physiotherapy appointment?",
        "Call the clinic or send a WhatsApp message to agree on a session time.",
      ],
      [
        "Do you have a cancellation policy?",
        "Read our cancellation policy if you need to cancel or postpone an appointment.",
      ],
      [
        "Are the physiotherapists at Ahmad Bakhach Physiotherapy Clinic licensed and experienced?",
        "Dr. Ahmad has two years of experience, including sports rehabilitation and home care. Contact the clinic for his current licensing and certification details.",
      ],
      [
        "What can I expect during my first visit?",
        "We’ll discuss your medical history, assess your movement, carry out relevant tests and work with you to create a personal care plan.",
      ],
      [
        "What should I wear for my first session?",
        "Wear comfortable sweatpants or shorts and a shirt that lets you move freely.",
      ],
      [
        "How long is the session?",
        "Sessions last between 45 and 75 minutes, depending on your needs.",
      ],
    ],
    demo: "Demo photography, institution logos and testimonials.",
    portrait: "Illustrative portrait of a physiotherapist",
    message: "Hello Dr. Ahmad, I’d like to book a session.",
    firstVisit: "Your first visit",
    conditions: "Related concerns",
    assessment: "Your assessment",
    bring: "What to bring",
    bookingNote:
      "Your session is confirmed when you and the clinic agree on a day and time.",
  },
  ar: {
    title: "د. أحمد بخاش | العلاج الفيزيائي في لبنان",
    description:
      "علاج فيزيائي رياضي وإعادة تأهيل ورعاية منزلية مع د. أحمد بخاش في لبنان.",
    home: "الرئيسية",
    about: "نبذة عنّي",
    values: "قيمي",
    services: "الخدمات",
    articles: "المقالات",
    faq: "أسئلة شائعة",
    contact: "تواصل",
    skip: "انتقل إلى المحتوى",
    menu: "القائمة",
    heroLine: "أيدٍ ترعاك كما تستحقّ.",
    book: "احجز جلسة",
    specialty: "العلاج الفيزيائي في لبنان",
    certifications: "الشهادات",
    demoLogos: "شعارات مؤسسات توضيحية",
    hello: "مرحباً، أنا أحمد بخاش",
    bio: "أنا معالج فيزيائي أختصّ بالعلاج الفيزيائي الرياضي وإعادة تأهيل الرياضيين. أحرص على رعاية كلّ مريض باهتمام، وأقدّم أيضاً جلسات علاج فيزيائي منزلية للمرضى في لبنان.",
    approach: "كيف نعمل معاً؟",
    approachText:
      "في الجلسة الأولى، نتحدّث عن تاريخك الصحي والأنشطة التي ترغب في استعادتها. نقيّم حركتك ونتّفق معاً على خطة تناسب أهدافك.",
    numbers: "العيادة بالأرقام",
    testimonials: "آراء المراجعين",
    sampleQuotes: "تجارب مرضى توضيحية",
    quotes: [
      [
        "جئت لأنني أريد العودة إلى لعب كرة القدم في عطلة الأسبوع. ساعدني أن يكون هذا الهدف الواضح محور نقاشنا.",
        "التأهيل الرياضي",
      ],
      [
        "ساعدتنا إمكانية مناقشة الرعاية المنزلية على ترتيب الزيارة بما يناسب عائلتنا.",
        "الرعاية المنزلية",
      ],
    ],
    learn: "اعرف المزيد",
    featured: "مقالات مختارة",
    allArticles: "عرض جميع المقالات",
    questions: "الأسئلة الشائعة",
    priority: "امنح صحتك الأولوية",
    chat: "تواصل عبر واتساب",
    call: "اتصل بالعيادة",
    policy: "سياسة الإلغاء",
    policyText:
      "لإلغاء جلسة أو تأجيلها، اتصل بالعيادة أو أرسل رسالة تتضمن تاريخ الموعد ووقته. اطلب تأكيد التغيير واستفسر عن مهلة الإشعار أو أي رسوم تخص حجزك.",
    faqItems: [
      [
        "ما الخدمات التي تقدّمها العيادة؟",
        "تقدّم العيادة في لبنان التأهيل العضلي الهيكلي والعصبي وتأهيل الإصابات الرياضية والتعامل مع الألم والتوتر، إضافة إلى العلاج بالإبر الجافة والحجامة الرطبة.",
      ],
      [
        "كيف أحجز موعداً للعلاج الفيزيائي؟",
        "اتصل بالعيادة أو أرسل رسالة عبر واتساب للاتفاق على وقت الجلسة.",
      ],
      [
        "هل لديكم سياسة لإلغاء المواعيد؟",
        "يمكنك الاطّلاع على سياسة الإلغاء عند الحاجة إلى إلغاء موعدك أو تأجيله.",
      ],
      [
        "هل يتمتع المعالجون في عيادة أحمد بخاش بالترخيص والخبرة؟",
        "لدى د. أحمد سنتان من الخبرة، تشملان التأهيل الرياضي والرعاية المنزلية. تواصل مع العيادة للاطّلاع على تفاصيل الترخيص والشهادات الحالية.",
      ],
      [
        "ماذا أتوقّع في الزيارة الأولى؟",
        "نناقش تاريخك الصحي، ونقيّم حركتك ونجري الاختبارات الملائمة، ثم نضع معك خطة رعاية تناسب احتياجاتك.",
      ],
      [
        "ماذا أرتدي في الجلسة الأولى؟",
        "ارتدِ بنطالاً رياضياً مريحاً أو سروالاً قصيراً وقميصاً يتيح لك الحركة بحرية.",
      ],
      ["كم تستغرق الجلسة؟", "تستغرق الجلسة بين ٤٥ و٧٥ دقيقة حسب احتياجاتك."],
    ],
    demo: "صور وشعارات مؤسسات وشهادات مراجعين توضيحية.",
    portrait: "صورة توضيحية لمعالج فيزيائي",
    message: "مرحباً د. أحمد، أودّ حجز جلسة.",
    firstVisit: "زيارتك الأولى",
    conditions: "حالات ذات صلة",
    assessment: "تقييم حالتك",
    bring: "ما الذي تحضره معك؟",
    bookingNote: "يتأكّد موعد الجلسة عندما تتّفق مع العيادة على اليوم والساعة.",
  },
};

export function bookingHref(locale: Locale) {
  return `https://wa.me/${practice.whatsapp}?text=${encodeURIComponent(content[locale].message)}`;
}
