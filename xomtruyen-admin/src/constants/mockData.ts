import type { IUser } from '../types/user';
import type { IBook } from '../types/book';
import type { ITopic } from '../types/topic';
import type { ICategory } from '../types/category';

export const STATUSES = ['Approved', 'Rejected', 'New', 'Pending'];

export const MOCK_USERS: IUser[] = [
  { id: '1', name: 'Alice Brown', avatar: 'https://i.pravatar.cc/150?u=1', leaveType: 'Casual Leave', department: 'Front-End Developer', days: '3 Days', start: '01 Sep 2024', end: '03 Sep 2024', status: 'Approved' },
  { id: '2', name: 'Brian Clark', avatar: 'https://i.pravatar.cc/150?u=2', leaveType: 'Paternity Leave', department: 'QA Engineer', days: '5 Days', start: '10 Sep 2024', end: '14 Sep 2024', status: 'Rejected' },
  { id: '3', name: 'Catherine Lee', avatar: 'https://i.pravatar.cc/150?u=3', leaveType: 'Maternity Leave', department: 'Product Manager', days: '2 Days', start: '05 Sep 2024', end: '06 Sep 2024', status: 'New' },
  { id: '4', name: 'Daniel Edwards', avatar: 'https://i.pravatar.cc/150?u=edward', leaveType: 'Sick Leave', department: 'Backend Developer', days: '2 Days', start: '01 Oct 2024', end: '02 Oct 2024', status: 'Rejected' },
  { id: '5', name: 'Daniel Fox', avatar: 'https://i.pravatar.cc/150?u=4', leaveType: 'Casual Leave', department: 'UI/UX Designer', days: '1 Day', start: '08 Sep 2024', end: '08 Sep 2024', status: 'Approved' },
  { id: '6', name: 'Evelyn King', avatar: 'https://i.pravatar.cc/150?u=5', leaveType: 'Sick Leave', department: 'Backend Developer', days: '2 Days', start: '11 Sep 2024', end: '12 Sep 2024', status: 'Rejected' },
  { id: '7', name: 'Fiona White', avatar: 'https://i.pravatar.cc/150?u=6', leaveType: 'Casual Leave', department: 'Marketing Executive', days: '3 Days', start: '13 Sep 2024', end: '15 Sep 2024', status: 'Approved' },
  { id: '8', name: 'George Martin', avatar: 'https://i.pravatar.cc/150?u=7', leaveType: 'Sabbatical', department: 'HR Manager', days: '10 Days', start: '01 Oct 2024', end: '10 Oct 2024', status: 'Pending' },
  { id: '9', name: 'Hannah Scott', avatar: 'https://i.pravatar.cc/150?u=8', leaveType: 'Casual Leave', department: 'Content Writer', days: '1 Day', start: '15 Sep 2024', end: '15 Sep 2024', status: 'Approved' },
  { id: '10', name: 'Ian Cooper', avatar: 'https://i.pravatar.cc/150?u=9', leaveType: 'Sick Leave', department: 'DevOps Engineer', days: '4 Days', start: '18 Sep 2024', end: '21 Sep 2024', status: 'Rejected' },
  { id: '11', name: 'Julia Adams', avatar: 'https://i.pravatar.cc/150?u=10', leaveType: 'Unpaid Leave', department: 'Customer Support', days: '2 Days', start: '22 Sep 2024', end: '23 Sep 2024', status: 'Pending' },
  { id: '12', name: 'Kevin Davis', avatar: 'https://i.pravatar.cc/150?u=11', leaveType: 'Casual Leave', department: 'Software Engineer', days: '1 Day', start: '25 Sep 2024', end: '25 Sep 2024', status: 'Approved' },
  { id: '13', name: 'Laura Martinez', avatar: 'https://i.pravatar.cc/150?u=12', leaveType: 'Sick Leave', department: 'Data Analyst', days: '3 Days', start: '26 Sep 2024', end: '28 Sep 2024', status: 'New' },
  { id: '14', name: 'Michael Taylor', avatar: 'https://i.pravatar.cc/150?u=13', leaveType: 'Paternity Leave', department: 'System Admin', days: '5 Days', start: '01 Nov 2024', end: '05 Nov 2024', status: 'Pending' },
  { id: '15', name: 'Nancy Wilson', avatar: 'https://i.pravatar.cc/150?u=14', leaveType: 'Casual Leave', department: 'Project Manager', days: '2 Days', start: '10 Oct 2024', end: '11 Oct 2024', status: 'Approved' },
  { id: '16', name: 'Oliver Anderson', avatar: 'https://i.pravatar.cc/150?u=15', leaveType: 'Sick Leave', department: 'Marketing', days: '1 Day', start: '02 Sep 2024', end: '02 Sep 2024', status: 'Rejected' }
];

export const MOCK_BOOKS: IBook[] = [
  { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Classic', published: '1925', cover: 'https://i.pravatar.cc/150?u=b1', status: 'Approved' },
  { id: '2', title: '1984', author: 'George Orwell', category: 'Dystopian', published: '1949', cover: 'https://i.pravatar.cc/150?u=b2', status: 'Pending' },
  { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Classic', published: '1960', cover: 'https://i.pravatar.cc/150?u=b3', status: 'Approved' },
];

export const MOCK_TOPICS: ITopic[] = [
  { id: '1', name: 'Science Fiction', description: 'Books about futuristic concepts.', createdAt: '2024-01-01', status: 'Approved' },
  { id: '2', name: 'Fantasy', description: 'Books containing magical elements.', createdAt: '2024-01-05', status: 'New' },
  { id: '3', name: 'History', description: 'Historical events and figures.', createdAt: '2024-02-10', status: 'Approved' },
];

export const MOCK_CATEGORIES: ICategory[] = [
  { id: '1', name: 'Fiction', description: 'Fictional literature.', createdAt: '2024-01-01', status: 'Approved' },
  { id: '2', name: 'Non-Fiction', description: 'Factual and informative literature.', createdAt: '2024-01-05', status: 'Pending' },
  { id: '3', name: 'Educational', description: 'Books for learning and education.', createdAt: '2024-02-10', status: 'Approved' },
];
