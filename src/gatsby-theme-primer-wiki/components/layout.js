import { Box } from "@primer/components";
import Header from "gatsby-theme-primer-wiki/src/components/header";
import Sidebar from "gatsby-theme-primer-wiki/src/components/sidebar";
import { getSidebarItems } from "gatsby-theme-primer-wiki/src/utils/sidebar-items";
import Clarity from '@microsoft/clarity';
import "../styles/global.css";

if (process.env.NODE_ENV === 'production') {
  const projectId = "rhs71m1jem";
  Clarity.init(projectId);
}

function Layout({ children, location, pageContext }) {
  const sidebarItems = pageContext.sidebarItems;
  const tagsGroups = pageContext.tagsGroups;
  const currentSlug = pageContext.slug;
  const finalSidebarItems = getSidebarItems(sidebarItems, tagsGroups);
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bg="bg.primary"
      color="text.primary"
    >
      <Header
        currentSlug={currentSlug}
        location={location}
        sidebarItems={finalSidebarItems}
        tagsGroups={tagsGroups}
      />
      <Box
        display="flex"
        flex="1 1 auto"
        flexDirection="row"
        css={{ zIndex: 0 }}
      >
        <Sidebar location={location} sidebarItems={finalSidebarItems} />
        <Box as="main" flex="1">
          {children}
        </Box>
      </Box>
    </Box>
  );
}

export default Layout;
