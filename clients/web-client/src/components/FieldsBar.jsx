import { Tabs, Tab, Box, useMediaQuery, useTheme } from '@mui/material';

export default function FieldsBar({ tabs = [], activeTab, setActiveTab }) {
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#fafafa' }}>
      <Tabs
        value={activeTab}
        onChange={handleChange}
        variant={isMobile ? 'scrollable' : 'standard'}
        scrollButtons={isMobile ? 'auto' : false}
        centered={!isMobile}
        indicatorColor="primary"
        textColor="primary"
      >
        {tabs.map((tab) => (
          <Tab
            key={tab.name}
            icon={tab.icon}
            iconPosition="start"
            label={tab.label}
            value={tab.name}
          />
        ))}
      </Tabs>
    </Box>
  );
}

