import { Button, Input, Text, Card, Progress } from '@nextui-org/react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Breadcrumbs, Crumb, CrumbLink } from '../breadcrumb/breadcrumb.styled';
import { HouseIcon } from '../icons/breadcrumb/house-icon';
import { UsersIcon } from '../icons/breadcrumb/users-icon';
import { SettingsIcon } from '../icons/sidebar/settings-icon';
import { DotsIcon } from '../icons/accounts/dots-icon';
import { InfoIcon } from '../icons/accounts/info-icon';
import { Flex } from '../styles/flex';
import dynamic from 'next/dynamic';

// Dynamically import ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

// Interface for course data
interface Course {
  _id: string;
  courseId: number;
  title: string;
  description: string;
  thumbnail: string;
  total_lessons: number;
  studentProgress?: {
    completedLessons: number;
    totalLessons: number;
    timeSpent: number;
    progress: number;
    lastAccessed: string;
  };
  // Add missing properties that are being used in the component
  completed_lessons?: number;
  progress?: number;
  time_spent?: number;
  time_agent?: string; // Added missing property
  completed?: boolean; // Added missing property
}

// Interface for dashboard stats
interface DashboardStats {
  totalCourses: number;
  totalTimeSpent: number;
  averageProgress: number;
  completedCourses: number;
  inProgressCourses: number;
  recentCourses?: Course[];
}

// Define proper types for chart options using ApexCharts types
interface TimeSeriesOptions {
  chart: {
    type: 'line';
    height: number;
    zoom: {
      enabled: boolean;
    };
  };
  dataLabels: {
    enabled: boolean;
  };
  stroke: {
    curve: 'smooth';
  };
  title: {
    text: string;
    align: 'left';
  };
  grid: {
    row: {
      colors: string[];
      opacity: number;
    };
  };
  xaxis: {
    categories: string[];
  };
}

interface PieChartOptions {
  chart: {
    type: 'donut';
  };
  title: {
    text: string;
  };
  labels: string[];
  colors: string[];
  responsive: {
    breakpoint: number;
    options: {
      chart: {
        width: number;
      };
      legend: {
        position: 'bottom';
      };
    };
  }[];
}

const Dashboard = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Get user ID from localStorage or context (assuming user is logged in)
      const userId = 1; // Replace with actual user ID from auth context

      // Fetch dashboard stats
      const statsResponse = await fetch(`http://localhost:7005/course/dashboard/stats?userId=${userId}`);
      const statsData = await statsResponse.json();

      if (statsData.status === 'success') {
        setStats(statsData.data);
        
        // If we have recent courses from stats, use them
        if (statsData.data.recentCourses && statsData.data.recentCourses.length > 0) {
          setCourses(statsData.data.recentCourses);
        } else {
          // Otherwise fetch course details separately
          const courseIds = [1, 2]; // Default course IDs - adjust as needed
          const coursesResponse = await fetch('http://localhost:7005/course/courses/details', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              courseIds, 
              userId 
            }),
          });
          const coursesData = await coursesResponse.json();
          
          if (coursesData.status === 'success') {
            setCourses(coursesData.courses);
          }
        }
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Mock data for charts with proper typing
  const timeSeriesData = {
    options: {
      chart: {
        type: 'line' as const,
        height: 350,
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth' as const
      },
      title: {
        text: 'Learning Progress Over Time',
        align: 'left' as const
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5
        },
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
      }
    },
    series: [
      {
        name: 'JavaScript',
        data: [10, 25, 35, 50, 49, 60, 70]
      },
      {
        name: 'React.js',
        data: [5, 15, 25, 30, 40, 45, 55]
      }
    ]
  };

  const pieChartData = {
    options: {
      chart: {
        type: 'donut' as const,
      },
      title: {
        text: 'Course Completion Status'
      },
      labels: ['Completed', 'In Progress', 'Not Started'],
      colors: ['#00C851', '#ffbb33', '#ff4444'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom' as const
          }
        }
      }]
    },
    series: stats ? [stats.completedCourses, stats.inProgressCourses, stats.totalCourses - stats.completedCourses - stats.inProgressCourses] : [0, 0, 0]
  };

  if (loading) {
    return (
      <Flex
        css={{
          'mt': '$5',
          'px': '$6',
          '@sm': {
            mt: '$10',
            px: '$16',
          },
        }}
        justify={'center'}
        align={'center'}
        direction={'column'}
      >
        <Text h3>Loading Dashboard...</Text>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex
        css={{
          'mt': '$5',
          'px': '$6',
          '@sm': {
            mt: '$10',
            px: '$16',
          },
        }}
        justify={'center'}
        align={'center'}
        direction={'column'}
      >
        <Text h3 color="error">{error}</Text>
        <Button auto css={{ mt: '$10' }} onClick={fetchDashboardData}>
          Retry
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      css={{
        'mt': '$5',
        'px': '$6',
        '@sm': {
          mt: '$10',
          px: '$16',
        },
      }}
      justify={'center'}
      direction={'column'}
    >
      <Breadcrumbs>
        <Crumb>
          <HouseIcon />
          <Link href={'/'}>
            <CrumbLink href="#">Home</CrumbLink>
          </Link>
          <Text>/</Text>
        </Crumb>
        <Crumb>
          <CrumbLink href="#">Dashboard</CrumbLink>
        </Crumb>
      </Breadcrumbs>

      <Text h3>Student Learning Dashboard</Text>
      
      {/* Stats Overview */}
      <Flex
        css={{ gap: '$6', mb: '$10' }}
        wrap={'wrap'}
      >
        <Card css={{ p: '$6', flex: '1 1 200px' }}>
          <Flex css={{ gap: '$6' }} align="center">
            <DotsIcon />
            <Flex direction="column">
              <Text span css={{ color: '$accents8' }}>Total Courses</Text>
              <Text h4 css={{ mt: '$2' }}>{stats?.totalCourses || 0}</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card css={{ p: '$6', flex: '1 1 200px' }}>
          <Flex css={{ gap: '$6' }} align="center">
            <SettingsIcon />
            <Flex direction="column">
              <Text span css={{ color: '$accents8' }}>Total Time Spent</Text>
              <Text h4 css={{ mt: '$2' }}>{stats?.totalTimeSpent?.toFixed(1) || 0} hours</Text>
            </Flex>
          </Flex>
        </Card>
        
        <Card css={{ p: '$6', flex: '1 1 200px' }}>
          <Flex css={{ gap: '$6' }} align="center">
            <InfoIcon />
            <Flex direction="column">
              <Text span css={{ color: '$accents8' }}>Average Progress</Text>
              <Text h4 css={{ mt: '$2' }}>{stats?.averageProgress?.toFixed(1) || 0}%</Text>
            </Flex>
          </Flex>
        </Card>
      </Flex>

      {/* Course Progress Section */}
      <Text h4 css={{ mb: '$6' }}>My Courses</Text>
      <Flex css={{ gap: '$8', mb: '$10' }} wrap={'wrap'}>
        {courses.map((course) => (
          <Card key={course._id} css={{ p: '$6', width: '100%', '@sm': { width: '48%' } }}>
            <Flex direction="column" css={{ gap: '$4' }}>
              <Flex justify="between" align="center">
                <Text h5>{course.title}</Text>
                <Text span css={{ color: '$accents7' }}>
                  {course.studentProgress?.completedLessons || course.completed_lessons || 0}/{course.total_lessons} lessons
                </Text>
              </Flex>
              
              <Text span css={{ color: '$accents7' }}>
                {course.description}
              </Text>
              
              <Progress 
                value={course.studentProgress?.progress || course.progress || 0} 
                color="primary" 
                status="primary"
              />
              
              <Flex justify="between" css={{ mt: '$2' }}>
                <Text span css={{ color: '$accents7' }}>
                  {course.studentProgress?.progress || course.progress || 0}% Complete
                </Text>
                <Text span css={{ color: '$accents7' }}>
                  ⏱ {course.studentProgress?.timeSpent || course.time_spent || 0}h
                </Text>
              </Flex>
              
              {/* Safely access time_agent with optional chaining */}
              {course.time_agent && (
                <Text span small css={{ color: '$accents6', mt: '$2' }}>
                  {course.time_agent}
                </Text>
              )}
              
              <Button auto css={{ mt: '$4' }}>
                Continue Learning
              </Button>
            </Flex>
          </Card>
        ))}
      </Flex>

      {/* Charts Section */}
      <Flex css={{ gap: '$8' }} wrap={'wrap'}>
        {/* Time Series Chart */}
        <Card css={{ p: '$6', flex: '1 1 400px' }}>
          <Text h5 css={{ mb: '$6' }}>Learning Progress Trend</Text>
          {typeof window !== 'undefined' && (
            <Chart
              options={timeSeriesData.options}
              series={timeSeriesData.series}
              type="line"
              height={350}
            />
          )}
        </Card>
        
        {/* Pie Chart */}
        <Card css={{ p: '$6', flex: '1 1 300px' }}>
          <Text h5 css={{ mb: '$6' }}>Completion Status</Text>
          {typeof window !== 'undefined' && (
            <Chart
              options={pieChartData.options}
              series={pieChartData.series}
              type="donut"
              height={350}
            />
          )}
        </Card>
      </Flex>

      {/* Recommendations Section */}
      <Card css={{ p: '$6', mt: '$10' }}>
        <Text h5 css={{ mb: '$6' }}>Recommended Next Steps</Text>
        <Flex direction="column" css={{ gap: '$4' }}>
          {courses.filter(course => {
            const progress = course.studentProgress?.progress || course.progress || 0;
            return progress < 100;
          }).map(course => (
            <Flex key={course._id} justify="between" align="center">
              <Text>Continue {course.title} - {course.studentProgress?.progress || course.progress || 0}% complete</Text>
              <Button auto size="sm">Continue</Button>
            </Flex>
          ))}
          {courses.filter(course => {
            const progress = course.studentProgress?.progress || course.progress || 0;
            return progress < 100;
          }).length === 0 && (
            <Text css={{ textAlign: 'center', color: '$accents6' }}>
              All courses completed! Explore new courses.
            </Text>
          )}
        </Flex>
      </Card>
    </Flex>
  );
};
export default Dashboard;