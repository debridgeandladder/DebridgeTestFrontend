import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  RefreshCw, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  BarChart3,
  TrendingUp,
  Home,
  LogOut
} from 'lucide-react'
import Logo from '@/components/Logo.jsx'
import { api } from '@/lib/api-layer.js'
import { authService } from '@/lib/authService.js'
import { toast } from 'react-toastify'

function AdminDashboard() {
  const navigate = useNavigate()
  const [waitlistData, setWaitlistData] = useState([])
  const [stats, setStats] = useState({
    total: 0,
    users: 0,
    providers: 0,
    dailyStats: []
  })
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [userTypeFilter, setUserTypeFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0
  })

  const fetchWaitlistData = async () => {
    setLoading(true)
    try {
      const response = await api.getWaitlist({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        userType: userTypeFilter
      })
      
      setWaitlistData(response.data)
      setPagination(response.pagination)
    } catch (error) {
      console.error('Error fetching waitlist data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.getWaitlistStats()
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchWaitlistData()
    fetchStats()
  }, [currentPage, pageSize, searchTerm, userTypeFilter])

  const handleRefresh = () => {
    fetchWaitlistData()
    fetchStats()
  }

  const handleLogout = async () => {
    try {
      await authService.logout()
      toast.success('Logged out successfully')
      navigate('/admin')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Logout failed')
    }
  }

  const handleSearch = (value) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page when searching
  }

  const handleUserTypeFilter = (value) => {
    setUserTypeFilter(value)
    setCurrentPage(1) // Reset to first page when filtering
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getContactIcon = (contact) => {
    return contact.includes('@') ? '📧' : '📱'
  }

  const getContactDisplay = (member) => {
    return member.email || member.phone || 'N/A'
  }

  const getUserTypeDisplay = (member) => {
    return member.servicestype === 'serviceUser' ? 'Service User' : 'Service Provider'
  }

  const getUserTypeBadgeVariant = (member) => {
    return member.servicestype === 'serviceUser' ? 'default' : 'secondary'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-green-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Logo className="h-16 w-auto" textClassName="text-2xl font-bold text-gray-900" />
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="sm" className="border-green-200 hover:bg-green-50">
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
              </Link>
              <Button
                onClick={handleRefresh}
                disabled={loading}
                variant="outline"
                className="border-green-200 hover:bg-green-50"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-200 hover:bg-red-50 text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
              <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                Admin Dashboard
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.total}</div>
              <p className="text-xs text-gray-500">All waitlist members</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Users</CardTitle>
              <UserCheck className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.users}</div>
              <p className="text-xs text-gray-500">Looking for services</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Service Providers</CardTitle>
              <UserPlus className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.providers}</div>
              <p className="text-xs text-gray-500">Offering services</p>
            </CardContent>
          </Card>

          <Card className="border-green-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Registrations</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.dailyStats[stats.dailyStats.length - 1]?.count || 0}
              </div>
              <p className="text-xs text-gray-500">New signups today</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="waitlist">Waitlist Management</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Registration Trends Chart */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                  Registration Trends (Last 7 Days)
                </CardTitle>
                <CardDescription>
                  Daily registration count over the past week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.dailyStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis />
                      <Tooltip 
                        labelFormatter={(value) => new Date(value).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                        formatter={(value) => [value, 'Registrations']}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="#16a34a" 
                        strokeWidth={3}
                        dot={{ fill: '#16a34a', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, stroke: '#16a34a', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="waitlist" className="space-y-6">
            {/* Search and Filters */}
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle>Waitlist Management</CardTitle>
                <CardDescription>
                  Manage and view all waitlist members
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search by email or phone..."
                        value={searchTerm}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10 border-green-200 focus:border-green-500"
                      />
                    </div>
                  </div>
                  <Select value={userTypeFilter} onValueChange={handleUserTypeFilter}>
                    <SelectTrigger className="w-full sm:w-48 border-green-200">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="user">Service Users</SelectItem>
                      <SelectItem value="provider">Service Providers</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Waitlist Table */}
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Waitlist Members</CardTitle>
                    <CardDescription>
                      Showing {waitlistData.length} of {pagination.total} members
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Show:</span>
                    <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-green-600" />
                    <span className="ml-2">Loading...</span>
                  </div>
                ) : (
                  <>
                    <div className="rounded-md border border-green-200">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-green-50">
                            <TableHead className="text-green-800">Contact</TableHead>
                            <TableHead className="text-green-800">Type</TableHead>
                            <TableHead className="text-green-800">Joined</TableHead>
                            <TableHead className="text-green-800">Source</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {waitlistData.map((member) => (
                            <TableRow key={member.id} className="hover:bg-green-50/50">
                              <TableCell className="font-medium">
                                <div className="flex items-center gap-2">
                                  <span>{getContactIcon(getContactDisplay(member))}</span>
                                  {getContactDisplay(member)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={getUserTypeBadgeVariant(member)}
                                  className={member.servicestype === 'serviceUser' 
                                    ? 'bg-blue-100 text-blue-800 border-blue-200' 
                                    : 'bg-purple-100 text-purple-800 border-purple-200'
                                  }
                                >
                                  {getUserTypeDisplay(member)}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {formatDate(member.created_at)}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {member.location || 'Nigeria'}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.total)} of {pagination.total} entries
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="border-green-200 hover:bg-green-50"
                          >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                          </Button>
                          <span className="text-sm text-gray-500">
                            Page {currentPage} of {pagination.totalPages}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                            disabled={currentPage === pagination.totalPages}
                            className="border-green-200 hover:bg-green-50"
                          >
                            Next
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminDashboard
