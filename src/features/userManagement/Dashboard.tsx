import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, Typography, Box, Avatar, List, ListItem, ListItemAvatar, ListItemText, Divider, CircularProgress, Button } from '@mui/material';
import { useGetIdentity } from 'react-admin';
import PeopleIcon from '@mui/icons-material/People';
import SecurityIcon from '@mui/icons-material/Security';
import GradingIcon from '@mui/icons-material/Grading';
import DownloadIcon from '@mui/icons-material/Download';
import axiosClient from '../../api/axiosClient';

const Dashboard = () => {
    const { identity } = useGetIdentity();
    const [statsData, setStatsData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activities, setActivities] = useState<any[]>([]);
    const [activityOffset, setActivityOffset] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const ACTIVITY_PAGE_SIZE = 5;

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await axiosClient.get(`/admin/stats?activity_limit=${ACTIVITY_PAGE_SIZE}&activity_offset=0`);
                console.log("Admin Stats Data:", data);
                setStatsData(data);
                setActivities(data.recent_activity || []);
                setActivityOffset(ACTIVITY_PAGE_SIZE);
                if ((data.recent_activity?.length || 0) < ACTIVITY_PAGE_SIZE) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const handleSeeMore = async () => {
        if (loadingMore || !hasMore) return;
        
        setLoadingMore(true);
        try {
            const { data } = await axiosClient.get(`/admin/stats?activity_limit=${ACTIVITY_PAGE_SIZE}&activity_offset=${activityOffset}`);
            const newActivities = data.recent_activity || [];
            
            if (newActivities.length > 0) {
                setActivities(prev => [...prev, ...newActivities]);
                setActivityOffset(prev => prev + ACTIVITY_PAGE_SIZE);
            }
            
            if (newActivities.length < ACTIVITY_PAGE_SIZE) {
                setHasMore(false);
            }
        } catch (error) {
            console.error("Failed to fetch more activities", error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleDownloadCSV = async () => {
        if (isDownloading) return;
        setIsDownloading(true);
        try {
            // Using axios to handle auth headers automatically
            const response = await axiosClient.get('/admin/activities/download', {
                responseType: 'blob'
            });
            
            // Create a link and trigger download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'recent_activity.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download CSV", error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const stats = [
        { title: 'Total Users', value: statsData?.total_users || 0, icon: <PeopleIcon fontSize="large" sx={{ color: '#818cf8' }} />, color: 'rgba(99, 102, 241, 0.1)' },
        { title: 'Active Users (1h)', value: statsData?.active_sessions || 0, icon: <SecurityIcon fontSize="large" sx={{ color: '#34d399' }} />, color: 'rgba(52, 211, 153, 0.1)' },
    ];

    return (
        <Box sx={{ mt: 2 }}>
            {/* Welcome Section */}
            <Card sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                <CardContent>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 800, background: '-webkit-linear-gradient(45deg, #c084fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Welcome back, {identity?.fullName || 'Admin'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening in the F.R.A.U.D.S system today.
                    </Typography>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
                {stats.map((stat, index) => (
                    <Card key={index} sx={{ height: '100%', display: 'flex', alignItems: 'center', p: 2 }}>
                        <Box sx={{ p: 2, borderRadius: '50%', backgroundColor: stat.color, mr: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {stat.icon}
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>{stat.value}</Typography>
                            <Typography variant="subtitle2" color="text.secondary">{stat.title}</Typography>
                        </Box>
                    </Card>
                ))}
            </Box>

            {/* Recent Activity */}
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
                <Card sx={{ height: '100%' }}>
                    <CardHeader 
                        title="Recent Activity" 
                        titleTypographyProps={{ variant: 'h6', fontWeight: 700 }}
                        action={
                            <Button 
                                onClick={handleDownloadCSV} 
                                disabled={isDownloading}
                                startIcon={isDownloading ? <CircularProgress size={18} color="inherit" /> : <DownloadIcon />}
                                sx={{ 
                                    color: '#818cf8',
                                    fontWeight: 600,
                                    textTransform: 'none',
                                    '&:hover': { backgroundColor: 'rgba(129, 140, 248, 0.1)' },
                                    '&.Mui-disabled': { color: 'rgba(129, 140, 248, 0.5)' }
                                }}
                            >
                                {isDownloading ? 'Exporting...' : 'Export CSV'}
                            </Button>
                        }
                    />
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                    <CardContent sx={{ p: 0 }}>
                        <List>
                            {activities.map((activity: any, index: number) => (
                                <div key={index}>
                                    <ListItem alignItems="flex-start" sx={{ py: 2 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '14px', fontWeight: 600 }}>{activity.avatar}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={<Typography variant="subtitle1" fontWeight={600}>{activity.user}</Typography>}
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="text.primary">
                                                        {activity.action}
                                                    </Typography>
                                                    {" — " + activity.time}
                                                </>
                                            }
                                        />
                                    </ListItem>
                                    {index < (activities.length - 1) && <Divider variant="inset" component="li" sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />}
                                </div>
                            ))}
                        </List>
                        {hasMore && (
                            <Box sx={{ p: 2, textAlign: 'center' }}>
                                <Typography 
                                    variant="button" 
                                    component="div"
                                    onClick={handleSeeMore}
                                    sx={{ 
                                        cursor: 'pointer', 
                                        color: '#818cf8', 
                                        fontWeight: 600,
                                        '&:hover': { color: '#c084fc', textDecoration: 'underline' }
                                    }}
                                >
                                    {loadingMore ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                                    {loadingMore ? 'Loading...' : 'See more activity'}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Card sx={{ height: '100%', background: 'rgba(15, 23, 42, 0.4)' }}>
                    <CardHeader title="System Status" titleTypographyProps={{ variant: 'h6', fontWeight: 700 }} />
                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)' }} />
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Server Uptime</Typography>
                            <Typography variant="body2" fontWeight={600} color="success.main">{statsData?.system_status?.uptime || '0m'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="body2" color="text.secondary">Database Load</Typography>
                            <Typography variant="body2" fontWeight={600} color="warning.main">{statsData?.system_status?.db_load || 'Low'}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="body2" color="text.secondary">Security Level</Typography>
                            <Typography variant="body2" fontWeight={600} color="info.main">{statsData?.system_status?.security_level || 'High'}</Typography>
                        </Box>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
};

export default Dashboard;
