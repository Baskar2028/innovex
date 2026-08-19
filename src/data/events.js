import pptImage from '../assets/ppt.avif';
import projectExpoImage from '../assets/projectexpo.jpg';
import quizImage from '../assets/quiz.jpg';
import artnovaImage from '../assets/logo.webp';
import hennaImage from '../assets/henna.jpg';

export const eventsData = [
  {
    id: "ppt",
    category: "Technical",
    title: "01 — PREZI",
    image: pptImage,
    time: "12:00 PM – 2:00 PM",
    desc: "A technical presentation competition based on recent technological trends.",
    rules: [
      "Maximum of 4 members per team.",
      "PPT topic must be related to recent technological trends.",
      "Presentation duration: 5 minutes.",
      "Q&A duration: 2 minutes.",
      "PPT submission must be made through email.",
      "Top 3 teams will be shortlisted as winners.",
      "Participants must follow the allotted presentation time strictly."
    ]
  },
  {
    id: "expo",
    category: "Technical",
    title: "02 — PROTOSPARK",
    image: projectExpoImage,
    time: "12:00 PM – 2:00 PM",
    desc: "Showcase innovative projects designed to address real-world problems.",
    rules: [
      "Maximum of 4 members per team.",
      "The project must be functional or demonstrable.",
      "Presentation/demo duration: 5 minutes.",
      "Q&A duration: 2 minutes.",
      "Top 3 projects will be shortlisted as winners.",
      "Participants should bring all required equipment/software."
    ]
  },
  {
    id: "quiz",
    category: "Technical",
    title: "03 — QUIZMANIA",
    image: quizImage,
    time: "2:40 PM – 3:10 PM",
    desc: "A competitive technical quiz testing programming and core CS knowledge.",
    rules: [
      "Individual participation only.",
      "The competition consists of 2 rounds.",
      "Questions cover C, C++, Python, Java, JavaScript, DSA and CS concepts.",
      "No unfair means or external assistance is allowed.",
      "The Top 2 participants will be selected as winners."
    ]
  },
  {
    id: "logo",
    category: "Non-Technical",
    title: "04 — ARTNOVA",
    image: artnovaImage,
    time: "2:50 PM – 3:30 PM",
    desc: "A creative design challenge to create a logo based on an on-the-spot topic.",
    rules: [
      "Individual participation only.",
      "Participants must bring their own laptop or mobile phone.",
      "The design topic will be given on the spot.",
      "AI tools must NOT be used.",
      "Maximum design time: 30 minutes.",
      "Plagiarism or previously created designs are not allowed."
    ]
  },
  {
    id: "mehandi",
    category: "Non-Technical",
    title: "05 — HENNA FIEST",
    image: hennaImage,
    time: "2:50 PM – 3:30 PM",
    desc: "A creative Mehendi design competition focused on artistic skill.",
    rules: [
      "Individual participation only.",
      "Female participants only.",
      "Participants must bring their own Mehendi materials.",
      "Maximum time: 30 minutes.",
      "Designs will be judged based on creativity, neatness, and originality."
    ]
  }
];
