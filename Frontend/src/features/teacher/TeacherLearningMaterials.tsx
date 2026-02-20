import { useState } from "react";
import { Plus, Upload, FileText, Video, Image, Link, Download, Eye, Trash2, Edit } from "lucide-react";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";

interface TeacherLearningMaterialsProps {
  currentUser: any;
  selectedClass: string;
}

export function TeacherLearningMaterials({ currentUser, selectedClass }: TeacherLearningMaterialsProps) {
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [materialForm, setMaterialForm] = useState({
    title: "",
    description: "",
    type: "",
    category: "",
    content: "",
    fileUrl: "",
    tags: ""
  });

  const materialTypes = [
    { id: "document", name: "Document", icon: FileText, color: "text-blue-600" },
    { id: "video", name: "Video", icon: Video, color: "text-red-600" },
    { id: "image", name: "Image", icon: Image, color: "text-green-600" },
    { id: "link", name: "Web Link", icon: Link, color: "text-purple-600" }
  ];

  const categories = [
    "Water Conservation",
    "Renewable Energy",
    "Climate Change", 
    "Biodiversity",
    "Pollution Control",
    "Sustainable Living",
    "Recycling & Waste",
    "Environmental Science",
    "Green Technology",
    "Nature Protection"
  ];

  const sharedMaterials = [
    {
      id: "1",
      title: "Water Conservation Techniques",
      description: "Comprehensive guide on water saving methods for daily life",
      type: "document",
      category: "Water Conservation",
      uploadDate: "2024-03-15",
      downloads: 22,
      views: 45,
      size: "2.4 MB",
      author: "Sarah Green",
      tags: ["water", "conservation", "daily-tips"],
      sharedTo: ["Grade 10-A", "Grade 10-B"]
    },
    {
      id: "2",
      title: "Renewable Energy Explained",
      description: "Educational video about solar, wind, and hydroelectric power",
      type: "video",
      category: "Renewable Energy",
      uploadDate: "2024-03-12",
      downloads: 18,
      views: 38,
      size: "15.7 MB",
      author: "Sarah Green",
      tags: ["renewable", "energy", "solar", "wind"],
      sharedTo: ["Grade 10-A"]
    },
    {
      id: "3",
      title: "Climate Change Infographic",
      description: "Visual representation of climate change causes and effects",
      type: "image",
      category: "Climate Change",
      uploadDate: "2024-03-10",
      downloads: 25,
      views: 52,
      size: "1.8 MB",
      author: "Sarah Green",
      tags: ["climate", "infographic", "visual"],
      sharedTo: ["Grade 9-A", "Grade 9-B"]
    },
    {
      id: "4",
      title: "NASA Climate Kids",
      description: "Interactive website with climate change games and activities",
      type: "link",
      category: "Climate Change",
      uploadDate: "2024-03-08",
      downloads: 30,
      views: 67,
      size: "External Link",
      author: "Sarah Green",
      tags: ["interactive", "games", "nasa"],
      sharedTo: ["Grade 10-A", "Grade 9-A"]
    },
    {
      id: "5",
      title: "Biodiversity Study Worksheet",
      description: "Activity sheet for understanding ecosystem diversity",
      type: "document",
      category: "Biodiversity",
      uploadDate: "2024-03-05",
      downloads: 28,
      views: 41,
      size: "950 KB",
      author: "Sarah Green",
      tags: ["biodiversity", "worksheet", "ecosystem"],
      sharedTo: ["Grade 10-A"]
    }
  ];

  const handleAddMaterial = () => {
    if (materialForm.title && materialForm.type && materialForm.category) {
      // Add material logic here
      console.log("Adding material:", materialForm);
      setShowAddMaterial(false);
      setMaterialForm({
        title: "",
        description: "",
        type: "",
        category: "",
        content: "",
        fileUrl: "",
        tags: ""
      });
    }
  };

  const getTypeIcon = (type: string) => {
    const materialType = materialTypes.find(t => t.id === type);
    if (!materialType) return FileText;
    return materialType.icon;
  };

  const getTypeColor = (type: string) => {
    const materialType = materialTypes.find(t => t.id === type);
    if (!materialType) return "text-gray-600";
    return materialType.color;
  };

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Learning Materials</h2>
          <p className="text-sm text-gray-600">Share educational content with your students</p>
        </div>
        <Button 
          onClick={() => setShowAddMaterial(true)}
          className="bg-[#2ECC71] hover:bg-[#27AE60] text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Material
        </Button>
      </div>

      {/* Material Types Overview */}
      <div className="grid grid-cols-2 gap-3">
        {materialTypes.map((type) => {
          const Icon = type.icon;
          const count = sharedMaterials.filter(m => m.type === type.id).length;
          return (
            <Card key={type.id} className="p-4 text-center">
              <div className="flex flex-col items-center space-y-2">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Icon className={`w-6 h-6 ${type.color}`} />
                </div>
                <div>
                  <div className="font-medium text-gray-900">{type.name}</div>
                  <div className="text-sm text-gray-600">{count} items</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Quick Stats */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-[#2ECC71]">{sharedMaterials.length}</div>
            <div className="text-sm text-gray-600">Total Materials</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {sharedMaterials.reduce((sum, m) => sum + m.downloads, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Downloads</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {sharedMaterials.reduce((sum, m) => sum + m.views, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Views</div>
          </div>
        </div>
      </Card>

      {/* Materials List */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Shared Materials</h3>
        <div className="space-y-3">
          {sharedMaterials.map((material) => {
            const Icon = getTypeIcon(material.type);
            return (
              <Card key={material.id} className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className={`w-6 h-6 ${getTypeColor(material.type)}`} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{material.title}</h4>
                        <p className="text-sm text-gray-600">{material.description}</p>
                      </div>
                      <div className="flex items-center space-x-1 ml-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Material Info */}
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                      <span className="bg-gray-100 px-2 py-1 rounded text-xs">{material.category}</span>
                      <span>{material.size}</span>
                      <span>Uploaded {material.uploadDate}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {material.tags.map((tag, index) => (
                        <span key={index} className="bg-[#2ECC71]/10 text-[#2ECC71] px-2 py-1 rounded text-xs">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    {/* Shared To */}
                    <div className="text-sm text-gray-600 mb-3">
                      <span className="font-medium">Shared to: </span>
                      {material.sharedTo.join(", ")}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Download className="w-4 h-4" />
                          <span>{material.downloads} downloads</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Eye className="w-4 h-4" />
                          <span>{material.views} views</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-[#2ECC71] hover:bg-[#27AE60] text-white">
                        Share Again
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Add Material Modal */}
      {showAddMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Add Learning Material</h3>
                <button
                  onClick={() => setShowAddMaterial(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* Material Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Material Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {materialTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setMaterialForm({...materialForm, type: type.id})}
                        className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                          materialForm.type === type.id
                            ? "border-[#2ECC71] bg-[#2ECC71]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${type.color}`} />
                        <span className="text-sm font-medium">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={materialForm.title}
                  onChange={(e) => setMaterialForm({...materialForm, title: e.target.value})}
                  placeholder="Enter material title"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={materialForm.description}
                  onChange={(e) => setMaterialForm({...materialForm, description: e.target.value})}
                  placeholder="Describe the learning material"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={materialForm.category}
                  onChange={(e) => setMaterialForm({...materialForm, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Content Input Based on Type */}
              {materialForm.type === "document" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Document
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                  </div>
                </div>
              )}

              {materialForm.type === "video" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL or Upload
                  </label>
                  <input
                    type="url"
                    value={materialForm.fileUrl}
                    onChange={(e) => setMaterialForm({...materialForm, fileUrl: e.target.value})}
                    placeholder="Enter YouTube URL or upload video file"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                  />
                </div>
              )}

              {materialForm.type === "link" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Web Link URL
                  </label>
                  <input
                    type="url"
                    value={materialForm.fileUrl}
                    onChange={(e) => setMaterialForm({...materialForm, fileUrl: e.target.value})}
                    placeholder="https://example.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                  />
                </div>
              )}

              {materialForm.type === "image" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Click to upload image</p>
                    <p className="text-xs text-gray-500">JPG, PNG, GIF up to 5MB</p>
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={materialForm.tags}
                  onChange={(e) => setMaterialForm({...materialForm, tags: e.target.value})}
                  placeholder="e.g., water, conservation, tips"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-[#2ECC71] focus:border-[#2ECC71]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-4">
                <Button 
                  onClick={handleAddMaterial}
                  className="flex-1 bg-[#2ECC71] hover:bg-[#27AE60] text-white"
                >
                  Share with Class
                </Button>
                <Button 
                  onClick={() => setShowAddMaterial(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}