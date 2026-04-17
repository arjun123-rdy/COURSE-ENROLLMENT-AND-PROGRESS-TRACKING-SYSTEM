const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Course = require('./models/Course');

dotenv.config();

const sampleCourses = [
  {
    title: 'Complete React.js Developer Course',
    description: 'Master React from scratch to advanced concepts including Hooks, Context API, Redux, and React Router. Build real-world projects and become job-ready.',
    instructor: 'Sarah Johnson',
    category: 'Web Development',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    price: 49.99,
    duration: '32 hours',
    rating: 4.8,
    tags: ['React', 'JavaScript', 'Frontend', 'Hooks'],
    lessons: [
      { title: 'Introduction to React', description: 'What is React and why use it?', duration: 15, order: 1, type: 'video' },
      { title: 'JSX Fundamentals', description: 'Writing JSX and understanding the syntax', duration: 20, order: 2, type: 'video' },
      { title: 'Components & Props', description: 'Creating reusable components', duration: 25, order: 3, type: 'video' },
      { title: 'State & useState Hook', description: 'Managing component state', duration: 30, order: 4, type: 'video' },
      { title: 'useEffect & Lifecycle', description: 'Side effects and component lifecycle', duration: 25, order: 5, type: 'video' },
      { title: 'React Router', description: 'Navigation in React apps', duration: 20, order: 6, type: 'video' },
      { title: 'Context API', description: 'Global state management', duration: 30, order: 7, type: 'video' },
      { title: 'Final Project', description: 'Build a full React application', duration: 60, order: 8, type: 'video' }
    ]
  },
  {
    title: 'Node.js & Express Backend Development',
    description: 'Learn to build scalable backend applications with Node.js, Express, MongoDB, and RESTful APIs. Includes authentication, security, and deployment.',
    instructor: 'Michael Chen',
    category: 'Web Development',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400',
    price: 44.99,
    duration: '28 hours',
    rating: 4.7,
    tags: ['Node.js', 'Express', 'Backend', 'API'],
    lessons: [
      { title: 'Node.js Basics', description: 'Understanding Node.js runtime', duration: 20, order: 1, type: 'video' },
      { title: 'Express Framework', description: 'Building web servers with Express', duration: 25, order: 2, type: 'video' },
      { title: 'MongoDB & Mongoose', description: 'Working with MongoDB database', duration: 30, order: 3, type: 'video' },
      { title: 'RESTful API Design', description: 'Best practices for API design', duration: 20, order: 4, type: 'video' },
      { title: 'JWT Authentication', description: 'Secure your API with JWT', duration: 25, order: 5, type: 'video' },
      { title: 'Error Handling', description: 'Professional error handling', duration: 15, order: 6, type: 'video' },
      { title: 'Deployment', description: 'Deploy to production', duration: 30, order: 7, type: 'video' }
    ]
  },
  {
    title: 'Python for Data Science & Machine Learning',
    description: 'Comprehensive data science bootcamp covering Python, NumPy, Pandas, Matplotlib, Scikit-learn, and TensorFlow. Real datasets and ML projects included.',
    instructor: 'Dr. Emily Rodriguez',
    category: 'Data Science',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    price: 59.99,
    duration: '45 hours',
    rating: 4.9,
    tags: ['Python', 'Machine Learning', 'Data Analysis', 'TensorFlow'],
    lessons: [
      { title: 'Python Fundamentals', description: 'Core Python programming', duration: 30, order: 1, type: 'video' },
      { title: 'NumPy Arrays', description: 'Numerical computing with NumPy', duration: 25, order: 2, type: 'video' },
      { title: 'Pandas DataFrames', description: 'Data manipulation with Pandas', duration: 35, order: 3, type: 'video' },
      { title: 'Data Visualization', description: 'Creating charts with Matplotlib', duration: 20, order: 4, type: 'video' },
      { title: 'Machine Learning Basics', description: 'Introduction to ML algorithms', duration: 40, order: 5, type: 'video' },
      { title: 'Neural Networks', description: 'Building neural networks with TensorFlow', duration: 45, order: 6, type: 'video' }
    ]
  },
  {
    title: 'Flutter Mobile App Development',
    description: 'Build beautiful cross-platform mobile apps for iOS and Android using Flutter and Dart. Learn state management, animations, and Firebase integration.',
    instructor: 'Alex Kumar',
    category: 'Mobile Development',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400',
    price: 39.99,
    duration: '24 hours',
    rating: 4.6,
    tags: ['Flutter', 'Dart', 'iOS', 'Android', 'Firebase'],
    lessons: [
      { title: 'Dart Language Basics', description: 'Learn Dart programming', duration: 25, order: 1, type: 'video' },
      { title: 'Flutter Widgets', description: 'Core Flutter widget system', duration: 30, order: 2, type: 'video' },
      { title: 'State Management', description: 'Provider and BLoC patterns', duration: 35, order: 3, type: 'video' },
      { title: 'Navigation & Routing', description: 'App navigation in Flutter', duration: 20, order: 4, type: 'video' },
      { title: 'Firebase Integration', description: 'Backend with Firebase', duration: 30, order: 5, type: 'video' },
      { title: 'Publishing Apps', description: 'Deploy to App Store & Play Store', duration: 25, order: 6, type: 'video' }
    ]
  },
  {
    title: 'UI/UX Design Masterclass',
    description: 'Master the principles of UI/UX design using Figma. Learn user research, wireframing, prototyping, and design systems. Create stunning digital products.',
    instructor: 'Jessica Park',
    category: 'Design',
    level: 'Beginner',
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    price: 34.99,
    duration: '20 hours',
    rating: 4.7,
    tags: ['UI Design', 'UX Design', 'Figma', 'Prototyping'],
    lessons: [
      { title: 'Design Fundamentals', description: 'Color, typography, and layout', duration: 20, order: 1, type: 'video' },
      { title: 'User Research', description: 'Understanding your users', duration: 25, order: 2, type: 'video' },
      { title: 'Wireframing', description: 'Creating wireframes in Figma', duration: 30, order: 3, type: 'video' },
      { title: 'Prototyping', description: 'Interactive prototypes', duration: 25, order: 4, type: 'video' },
      { title: 'Design Systems', description: 'Building reusable components', duration: 30, order: 5, type: 'video' }
    ]
  },
  {
    title: 'AWS Cloud Practitioner & Solutions Architect',
    description: 'Prepare for AWS certifications. Learn EC2, S3, RDS, Lambda, VPC, and cloud architecture best practices. Includes hands-on labs and practice exams.',
    instructor: 'David Thompson',
    category: 'DevOps',
    level: 'Intermediate',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400',
    price: 54.99,
    duration: '38 hours',
    rating: 4.8,
    tags: ['AWS', 'Cloud', 'DevOps', 'Certification'],
    lessons: [
      { title: 'Cloud Computing Overview', description: 'Introduction to cloud services', duration: 15, order: 1, type: 'video' },
      { title: 'AWS Core Services', description: 'EC2, S3, and RDS basics', duration: 30, order: 2, type: 'video' },
      { title: 'Networking in AWS', description: 'VPC, subnets, and security groups', duration: 25, order: 3, type: 'video' },
      { title: 'Serverless with Lambda', description: 'Building serverless applications', duration: 20, order: 4, type: 'video' },
      { title: 'CI/CD Pipelines', description: 'Automated deployment pipelines', duration: 25, order: 5, type: 'video' },
      { title: 'Practice Exam Prep', description: 'Certification exam preparation', duration: 40, order: 6, type: 'reading' }
    ]
  }
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Course.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@learnhub.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create sample student
    await User.create({
      name: 'John Student',
      email: 'student@learnhub.com',
      password: 'student123',
      role: 'student'
    });

    // Create courses
    const courses = await Course.insertMany(
      sampleCourses.map(c => ({ ...c, createdBy: admin._id, enrolledCount: Math.floor(Math.random() * 1000) + 100 }))
    );

    console.log(`✅ Created ${courses.length} courses`);
    console.log('✅ Created admin: admin@learnhub.com / admin123');
    console.log('✅ Created student: student@learnhub.com / student123');
    console.log('🎉 Seed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
