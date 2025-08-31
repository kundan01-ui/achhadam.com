import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  Camera, 
  BarChart3, 
  TrendingUp, 
  FileText, 
  Download,
  Upload,
  Search,
  Filter,
  Star,
  AlertTriangle,
  Shield,
  Target,
  Eye,
  Edit,
  Plus,
  Calendar,
  MapPin,
  Users,
  Settings,
  RefreshCw,
  Zap,
  Leaf,
  Package,
  Scale,
  Thermometer,
  Droplets,
  Sun
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui';
import type { SelectOption } from '../../components/ui';

interface QualityInspection {
  id: string;
  cropId: string;
  cropName: string;
  farmerName: string;
  inspectionDate: Date;
  qualityScore: number;
  grade: 'A' | 'B' | 'C' | 'D';
  status: 'pending' | 'approved' | 'rejected' | 'under-review';
  inspector: string;
  photos: string[];
  parameters: {
    size: number;
    color: number;
    texture: number;
    moisture: number;
    defects: number;
    uniformity: number;
  };
  notes: string;
  recommendations: string[];
}

interface Certification {
  id: string;
  type: 'organic' | 'fair-trade' | 'gmp' | 'iso' | 'halal' | 'kosher';
  name: string;
  issuingBody: string;
  issueDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'pending' | 'suspended';
  scope: string[];
  documents: string[];
  auditHistory: Array<{
    date: Date;
    auditor: string;
    result: 'pass' | 'fail' | 'minor-nc' | 'major-nc';
    notes: string;
  }>;
}

interface QualityStandard {
  id: string;
  name: string;
  category: string;
  parameters: Array<{
    name: string;
    minValue: number;
    maxValue: number;
    unit: string;
    weight: number;
  }>;
  gradeThresholds: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  description: string;
}

const QualityAssurance: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedInspection, setSelectedInspection] = useState<QualityInspection | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const mockInspections: QualityInspection[] = [
    {
      id: '1',
      cropId: 'WHT-001',
      cropName: 'Wheat',
      farmerName: 'Rajesh Kumar',
      inspectionDate: new Date(),
      qualityScore: 87,
      grade: 'A',
      status: 'approved',
      inspector: 'Dr. Priya Sharma',
      photos: ['/api/placeholder/300/200', '/api/placeholder/300/200'],
      parameters: {
        size: 85,
        color: 90,
        texture: 88,
        moisture: 82,
        defects: 92,
        uniformity: 89
      },
      notes: 'Excellent quality wheat with uniform grain size and good moisture content. Minor color variations observed but within acceptable range.',
      recommendations: ['Maintain current harvesting practices', 'Consider slight delay in next harvest for better color uniformity']
    },
    {
      id: '2',
      cropId: 'RCE-002',
      cropName: 'Rice',
      farmerName: 'Amit Singh',
      inspectionDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      qualityScore: 76,
      grade: 'B',
      status: 'under-review',
      inspector: 'Dr. Rajesh Kumar',
      photos: ['/api/placeholder/300/200'],
      parameters: {
        size: 78,
        color: 75,
        texture: 80,
        moisture: 70,
        defects: 85,
        uniformity: 72
      },
      notes: 'Good quality rice with some moisture content issues. Size uniformity needs improvement.',
      recommendations: ['Improve drying process', 'Better sorting for size uniformity', 'Monitor moisture levels during storage']
    }
  ];

  const mockCertifications: Certification[] = [
    {
      id: '1',
      type: 'organic',
      name: 'India Organic Certification',
      issuingBody: 'APEDA',
      issueDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      status: 'active',
      scope: ['Wheat', 'Rice', 'Pulses'],
      documents: ['certificate.pdf', 'audit-report.pdf'],
      auditHistory: [
        {
          date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          auditor: 'Organic Certifiers India',
          result: 'pass',
          notes: 'Annual audit completed successfully. All requirements met.'
        }
      ]
    },
    {
      id: '2',
      type: 'fair-trade',
      name: 'Fair Trade International',
      issuingBody: 'Fair Trade India',
      issueDate: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
      status: 'active',
      scope: ['Wheat', 'Cotton'],
      documents: ['fair-trade-cert.pdf'],
      auditHistory: [
        {
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          auditor: 'Fair Trade Auditors',
          result: 'pass',
          notes: 'Social compliance audit passed. Worker welfare standards maintained.'
        }
      ]
    }
  ];

  const mockQualityStandards: QualityStandard[] = [
    {
      id: '1',
      name: 'Premium Wheat Quality Standard',
      category: 'Grains',
      parameters: [
        { name: 'Protein Content', minValue: 12, maxValue: 14, unit: '%', weight: 25 },
        { name: 'Moisture', minValue: 10, maxValue: 12, unit: '%', weight: 20 },
        { name: 'Test Weight', minValue: 78, maxValue: 82, unit: 'kg/hl', weight: 20 },
        { name: 'Falling Number', minValue: 300, maxValue: 400, unit: 'seconds', weight: 15 },
        { name: 'Ash Content', minValue: 1.5, maxValue: 2.0, unit: '%', weight: 10 },
        { name: 'Defects', minValue: 0, maxValue: 2, unit: '%', weight: 10 }
      ],
      gradeThresholds: {
        A: 90,
        B: 80,
        C: 70,
        D: 60
      },
      description: 'Premium quality wheat standard for export and high-end domestic markets.'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'under-review': return 'text-yellow-600 bg-yellow-100';
      case 'pending': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getCertificationStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'expired': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredInspections = mockInspections.filter(inspection => {
    const matchesSearch = inspection.cropName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inspection.farmerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         inspection.cropId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inspection.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const averageQualityScore = mockInspections.reduce((sum, inspection) => sum + inspection.qualityScore, 0) / mockInspections.length;
  const approvedInspections = mockInspections.filter(inspection => inspection.status === 'approved').length;
  const pendingInspections = mockInspections.filter(inspection => inspection.status === 'pending' || inspection.status === 'under-review').length;

  return (
    <div className="min-h-screen bg-neutral-gray p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500 rounded-full">
              <Award className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text-dark">Quality Assurance & Certification</h1>
              <p className="text-text-light">Maintain high standards and manage certifications</p>
            </div>
          </div>
          
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Quality Inspection
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 className="w-4 h-4" /> },
            { id: 'inspections', label: 'Quality Inspections', icon: <Eye className="w-4 h-4" /> },
            { id: 'certifications', label: 'Certifications', icon: <Award className="w-4 h-4" /> },
            { id: 'standards', label: 'Quality Standards', icon: <Target className="w-4 h-4" /> },
            { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> }
          ].map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 whitespace-nowrap"
            >
              {tab.icon}
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Average Quality Score</p>
                    <p className="text-2xl font-bold text-text-dark">{averageQualityScore.toFixed(1)}%</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Approved Inspections</p>
                    <p className="text-2xl font-bold text-text-dark">{approvedInspections}</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <AlertTriangle className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Pending Reviews</p>
                    <p className="text-2xl font-bold text-text-dark">{pendingInspections}</p>
                  </div>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 rounded-full">
                    <Award className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-text-light">Active Certifications</p>
                    <p className="text-2xl font-bold text-text-dark">{mockCertifications.filter(c => c.status === 'active').length}</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quality Trends & Recent Inspections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quality Trends */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Quality Score Trends</h3>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Quality Trends Chart</p>
                    <p className="text-sm">Interactive chart showing quality scores over time</p>
                  </div>
                </div>
              </Card>

              {/* Recent Inspections */}
              <Card>
                <h3 className="text-lg font-semibold mb-4">Recent Quality Inspections</h3>
                <div className="space-y-3">
                  {mockInspections.slice(0, 5).map(inspection => (
                    <div key={inspection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{inspection.cropName} - {inspection.farmerName}</h4>
                        <p className="text-xs text-text-light">{inspection.inspectionDate.toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(inspection.grade)}`}>
                          Grade {inspection.grade}
                        </span>
                        <span className="text-sm font-medium">{inspection.qualityScore}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'inspections' && (
          <div className="space-y-6">
            {/* Search & Filters */}
            <Card>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search inspections by crop, farmer, or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    leftIcon={<Search className="w-4 h-4" />}
                  />
                </div>
                <Select
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value)}
                  placeholder="Filter by status"
                >
                  <SelectOption value="all">All Status</SelectOption>
                  <SelectOption value="pending">Pending</SelectOption>
                  <SelectOption value="under-review">Under Review</SelectOption>
                  <SelectOption value="approved">Approved</SelectOption>
                  <SelectOption value="rejected">Rejected</SelectOption>
                </Select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </Card>

            {/* Inspections List */}
            <div className="space-y-4">
              {filteredInspections.map(inspection => (
                <Card key={inspection.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => {
                  setSelectedInspection(inspection);
                  setShowInspectionModal(true);
                }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{inspection.cropName} - {inspection.cropId}</h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(inspection.status)}`}>
                          {inspection.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(inspection.grade)}`}>
                          Grade {inspection.grade}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Farmer</p>
                            <p className="text-sm text-text-light">{inspection.farmerName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Inspection Date</p>
                            <p className="text-sm text-text-light">{inspection.inspectionDate.toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="text-sm font-medium">Quality Score</p>
                            <p className="text-sm text-text-light">{inspection.qualityScore}%</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-text-light">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4" />
                          <span>Size: {inspection.parameters.size}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sun className="w-4 h-4" />
                          <span>Color: {inspection.parameters.color}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4" />
                          <span>Texture: {inspection.parameters.texture}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Droplets className="w-4 h-4" />
                          <span>Moisture: {inspection.parameters.moisture}%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-2xl font-bold text-primary-green mb-2">
                        {inspection.qualityScore}%
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certifications' && (
          <div className="space-y-6">
            {/* Certifications Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockCertifications.map(certification => (
                <Card key={certification.id} className="hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Award className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold">{certification.name}</h3>
                    <p className="text-sm text-text-light">{certification.issuingBody}</p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Type</span>
                      <span className="font-medium capitalize">{certification.type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Status</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCertificationStatusColor(certification.status)}`}>
                        {certification.status}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Issue Date</span>
                      <span className="font-medium">{certification.issueDate.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Expiry Date</span>
                      <span className="font-medium">{certification.expiryDate.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-light">Scope</span>
                      <span className="font-medium">{certification.scope.length} crops</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'standards' && (
          <div className="space-y-6">
            {/* Quality Standards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockQualityStandards.map(standard => (
                <Card key={standard.id} className="hover:shadow-lg transition-shadow">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">{standard.name}</h3>
                    <p className="text-sm text-text-light mb-3">{standard.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Category:</span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">{standard.category}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="font-medium">Quality Parameters</h4>
                    {standard.parameters.map((param, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm font-medium">{param.name}</span>
                        <div className="text-right">
                          <span className="text-sm">{param.minValue}-{param.maxValue} {param.unit}</span>
                          <span className="text-xs text-text-light ml-2">({param.weight}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">Grade Thresholds</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(standard.gradeThresholds).map(([grade, threshold]) => (
                        <div key={grade} className="text-center p-2 bg-gray-50 rounded">
                          <div className="text-lg font-bold text-primary-green">Grade {grade}</div>
                          <div className="text-sm text-text-light">≥{threshold}%</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reports' && (
          <Card>
            <h3 className="text-lg font-semibold mb-4">Quality Reports & Analytics</h3>
            <div className="text-center p-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">Quality Reports Coming Soon</p>
              <p className="text-sm">Comprehensive quality reporting and analytics dashboard</p>
            </div>
          </Card>
        )}

        {/* Inspection Details Modal */}
        {showInspectionModal && selectedInspection && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Quality Inspection Details</h2>
                <Button variant="outline" size="sm" onClick={() => setShowInspectionModal(false)}>
                  <XCircle className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Inspection Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-light">Crop</label>
                      <p className="font-medium">{selectedInspection.cropName} ({selectedInspection.cropId})</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Farmer</label>
                      <p className="font-medium">{selectedInspection.farmerName}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Inspector</label>
                      <p className="font-medium">{selectedInspection.inspector}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Date</label>
                      <p className="font-medium">{selectedInspection.inspectionDate.toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Quality Assessment</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-text-light">Overall Score</label>
                      <p className="text-2xl font-bold text-primary-green">{selectedInspection.qualityScore}%</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Grade</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(selectedInspection.grade)}`}>
                        Grade {selectedInspection.grade}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-text-light">Status</label>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedInspection.status)}`}>
                        {selectedInspection.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Quality Parameters</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(selectedInspection.parameters).map(([key, value]) => (
                    <div key={key} className="p-3 bg-gray-50 rounded-lg text-center">
                      <label className="text-sm font-medium text-text-light capitalize">{key}</label>
                      <p className="text-lg font-semibold">{value}%</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Notes & Recommendations</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-text-light">Inspection Notes</label>
                    <p className="text-sm text-text-dark mt-1">{selectedInspection.notes}</p>
                  </div>
                  
                  {selectedInspection.recommendations.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-text-light">Recommendations</label>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        {selectedInspection.recommendations.map((rec, index) => (
                          <li key={index} className="text-sm text-text-dark">{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-6 flex gap-3">
                <Button className="flex-1">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve Inspection
                </Button>
                <Button variant="outline">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Inspection
                </Button>
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject Inspection
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityAssurance;





