import React from 'react';
import { 
  Folder, File, FileText, Table, 
  Image, Video, Archive, Music,
  FileCode, FileJson, FileSpreadsheet,
  HardDrive, Database, Lock
} from 'lucide-react';

const FileIcon = ({ type, name, icon, color = 'gray', size = 24, className = '' }) => {
  
  // Determine icon based on file type/extension
  const getIconComponent = () => {
    // If specific icon is provided
    if (icon) {
      switch(icon) {
        case 'Folder': return <Folder size={size} className={`file-icon-${color}`} />;
        case 'FileText': return <FileText size={size} className={`file-icon-${color}`} />;
        case 'Table': return <Table size={size} className={`file-icon-${color}`} />;
        case 'Image': return <Image size={size} className={`file-icon-${color}`} />;
        case 'Video': return <Video size={size} className={`file-icon-${color}`} />;
        case 'Archive': return <Archive size={size} className={`file-icon-${color}`} />;
        case 'Music': return <Music size={size} className={`file-icon-${color}`} />;
        case 'FileCode': return <FileCode size={size} className={`file-icon-${color}`} />;
        case 'FileJson': return <FileJson size={size} className={`file-icon-${color}`} />;
        case 'FileSpreadsheet': return <FileSpreadsheet size={size} className={`file-icon-${color}`} />;
        case 'HardDrive': return <HardDrive size={size} className={`file-icon-${color}`} />;
        case 'Database': return <Database size={size} className={`file-icon-${color}`} />;
        case 'Lock': return <Lock size={size} className={`file-icon-${color}`} />;
        default: return <File size={size} className={`file-icon-${color}`} />;
      }
    }
    
    // If no icon provided, determine by file extension
    if (type === 'folder') {
      return <Folder size={size} className={`file-icon-${color || 'yellow'}`} />;
    }
    
    if (type === 'drive') {
      return <HardDrive size={size} className={`file-icon-${color || 'blue'}`} />;
    }
    
    // Check file extension
    if (name) {
      const extension = name.split('.').pop().toLowerCase();
      
      switch(extension) {
        case 'log':
          return <FileText size={size} className="file-icon-cyan" />;
        case 'txt':
          return <FileText size={size} className="file-icon-gray" />;
        case 'csv':
        case 'xlsx':
        case 'xls':
          return <Table size={size} className="file-icon-green" />;
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'bmp':
          return <Image size={size} className="file-icon-purple" />;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
          return <Video size={size} className="file-icon-red" />;
        case 'mp3':
        case 'wav':
        case 'flac':
          return <Music size={size} className="file-icon-pink" />;
        case 'zip':
        case 'rar':
        case '7z':
        case 'tar':
        case 'gz':
          return <Archive size={size} className="file-icon-amber" />;
        case 'js':
        case 'jsx':
        case 'ts':
        case 'tsx':
        case 'py':
        case 'java':
        case 'cpp':
        case 'c':
        case 'html':
        case 'css':
          return <FileCode size={size} className="file-icon-blue" />;
        case 'json':
        case 'xml':
        case 'yaml':
        case 'yml':
          return <FileJson size={size} className="file-icon-orange" />;
        case 'sql':
        case 'db':
        case 'sqlite':
          return <Database size={size} className="file-icon-blue" />;
        default:
          return <File size={size} className="file-icon-gray" />;
      }
    }
    
    // Default fallback
    return <File size={size} className="file-icon-gray" />;
  };

  // Get emoji fallback for icons view
  const getEmoji = () => {
    if (type === 'folder') return '📁';
    if (type === 'drive') return '💾';
    
    if (name) {
      const extension = name.split('.').pop().toLowerCase();
      
      switch(extension) {
        case 'log': return '📜';
        case 'txt': return '📄';
        case 'csv':
        case 'xlsx':
        case 'xls': return '📊';
        case 'jpg':
        case 'jpeg':
        case 'png': return '🖼️';
        case 'mp4':
        case 'avi':
        case 'mov': return '🎬';
        case 'mp3':
        case 'wav': return '🎵';
        case 'zip':
        case 'rar': return '🗜️';
        case 'js':
        case 'jsx':
        case 'py': return '⚙️';
        case 'json':
        case 'xml': return '📋';
        case 'sql':
        case 'db': return '🗄️';
        default: return '📄';
      }
    }
    
    return '📄';
  };

  return (
    <div className={`file-icon-container ${className}`} title={name}>
      {getIconComponent()}
    </div>
  );
};

export default FileIcon;