import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Books } from './pages/Books';
import { BookDetails } from './pages/BookDetails';
import { Topics } from './pages/Topics';
import { Categories } from './pages/Categories';
import { Login } from './pages/Login';
import { Database } from './pages/Database';
import { DatabaseTableViewer } from './pages/DatabaseTableViewer';
import { BookFiles } from './pages/BookFiles';
import { Transactions } from './pages/Transactions';
import { SubscriptionPlans } from './pages/SubscriptionPlans';
import { Reviews } from './pages/Reviews';
import { CoinPackages } from './pages/CoinPackages';
import { Notifications } from './pages/Notifications';
import { Promotions } from './pages/Promotions';
import { Crawlers } from './pages/Crawlers';
import { Translation } from './pages/Translation';
import { TranslationUpload } from './pages/TranslationUpload';
import { TranslationJobDetail } from './pages/TranslationJobDetail';
import { TranslationReview } from './pages/TranslationReview';
import { TranslationGlossary } from './pages/TranslationGlossary';
import { Banners } from './pages/Banners';
import { HomeSections } from './pages/HomeSections';
import { Authors } from './pages/Authors';
import { Reports } from './pages/Reports';
import { SystemConfigs } from './pages/SystemConfigs';
import { ReadingAnalytics } from './pages/ReadingAnalytics';
import { EmailTemplates } from './pages/EmailTemplates';
import { HelpArticles } from './pages/HelpArticles';
import { BookChapters } from './pages/BookChapters';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/all-books" element={<Books key="all" />} />
              <Route path="/books" element={<Books key="books" formatType={1} />} />
              <Route path="/comics" element={<Books key="comics" formatType={2} />} />
              <Route path="/books/:id" element={<BookDetails />} />
              <Route path="/topics" element={<Topics />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/users" element={<Users />} />
              <Route path="/database" element={<Database />} />
              <Route path="/database/:tableName" element={<DatabaseTableViewer />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/book-files" element={<BookFiles />} />
              <Route path="/plans" element={<SubscriptionPlans />} />
              <Route path="/coin-packages" element={<CoinPackages />} />
              <Route path="/notifications" element={<Notifications />} />
          <Route path="/promotions" element={<Promotions />} />
          <Route path="/banners" element={<Banners />} />
          <Route path="/home-sections" element={<HomeSections />} />
          <Route path="/crawlers" element={<Crawlers />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/translation/upload" element={<TranslationUpload />} />
          <Route path="/translation/jobs/:id" element={<TranslationJobDetail />} />
          <Route path="/translation/review/:chapterId" element={<TranslationReview />} />
          <Route path="/translation/glossary" element={<TranslationGlossary />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/system-configs" element={<SystemConfigs />} />
          <Route path="/reading-analytics" element={<ReadingAnalytics />} />
          <Route path="/email-templates" element={<EmailTemplates />} />
          <Route path="/help-articles" element={<HelpArticles />} />
          <Route path="/book-chapters" element={<BookChapters />} />
            </Route>
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </Router>
    </AuthProvider>
  );
}

export default App;
