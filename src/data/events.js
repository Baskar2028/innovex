import pptImage from '../assets/ppt.avif';
import projectExpoImage from '../assets/projectexpo.jpg';
import quizImage from '../assets/quiz.jpg';
import artnovaImage from '../assets/logo.webp';
import debugImage from "../assets/debug.jpg";

export const eventsData = [
  {
    id: "ppt",
    category: "Technical",
    title: "01 — PREZI",
    subtitle: "Paper Presentation",
    image: pptImage,
    time: "12:00 PM – 1:00 PM",
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
    category: "Technical ",
    title: "02 — PROTOSPARK",
    subtitle: "Project Exploration",
    image: projectExpoImage,
    time: "1:00 PM – 2:00 PM",
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
    id: "debug",
    category: "Technical",
    title: "03 — TRY CRACK ME",
    subtitle: "Debugging",
    image: debugImage,
    time: "2:45 PM – 3:30 PM",
    desc: "Identify and resolve hidden bugs in provided code snippets to make the program execute successfully.",
    rules: [
      "Individual participation only.",
      "The round 1 preliminary round consist questions in programming languages , basic Database and OS commands ",
      "Buggy code snippets will be provided in 3 languages: C, Python, and Java. Participants can choose their preferred language.",
      "Judging criteria: Winners are determined based on the accuracy of the bug fixes and the fastest time of completion.",
      "The top 2 participants from the final round will be declared the winners.",
      "Use of the internet, AI tools (like ChatGPT), or flash drives is strictly prohibited during the competition."
    ]
  },
  {
    id: "quiz",
    category: "Non-Technical",
    title: "04 — QUIZMANIA",
    subtitle: "Quiz",
    image: quizImage,
    time: "2:40 PM – 3:10 PM",
    desc: "A fast-paced trivia competition testing your general awareness, logic, and basic technical knowledge.",
    rules: [
      "Individual participation only.",
      "The competition consists of 2 rounds (a preliminary round and a final round).",
      "Questions will cover a variety of topics including Logo Identification, Logical Reasoning, Jumbled Words, Sports, General Knowledge (GK), and basic Technical trivia.",
      "There is no negative marking for incorrect answers.",
      "Use of mobile phones, smartwatches, or any external assistance is strictly prohibited.",
      "The top two participants with the highest scores at the end of Round 2 will be declared as the winners."
    ]
  },
  {
    id: "logo",
    category: "Non-Technical",
    title: "05 — ARTNOVA",
    subtitle: "Poster Design",
    image: artnovaImage,
    time: "2:50 PM – 3:30 PM",
    desc: "A creative design challenge to create a logo based on an on-the-spot topic.",
    rules: [
      "Individual participation only.",
      "Participants must bring their own laptop or mobile phone.",
      "The design topic will be given on the spot.",
      "AI tools must NOT be used.",
      "The tool which actually allowed to use is: CANVA",
      "Maximum design time: 30 minutes.",
      "Plagiarism or previously created designs are not allowed.",
      "The top two participants with the highest scores at the end of Round 2 will be declared as the winners."
    ]
  }
];