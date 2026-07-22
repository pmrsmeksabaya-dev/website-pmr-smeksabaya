// src/components/SomeComponent.jsx
import { useLocalStorage } from '../hooks/useLocalStorage';

const SettingsPanel = () => {
  // Simpan preferensi user
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebarCollapsed', false);
  const [fontSize, setFontSize] = useLocalStorage('fontSize', 'medium');
  const [notifications, setNotifications] = useLocalStorage('notifications', true);

  return (
    <div>
      <label>
        <input 
          type="checkbox" 
          checked={sidebarCollapsed} 
          onChange={(e) => setSidebarCollapsed(e.target.checked)} 
        />
        Collapse Sidebar
      </label>
      
      <select 
        value={fontSize} 
        onChange={(e) => setFontSize(e.target.value)}
      >
        <option value="small">Small</option>
        <option value="medium">Medium</option>
        <option value="large">Large</option>
      </select>
      
      <label>
        <input 
          type="checkbox" 
          checked={notifications} 
          onChange={(e) => setNotifications(e.target.checked)} 
        />
        Enable Notifications
      </label>
    </div>
  );
};