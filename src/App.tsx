import { Shell, Footer } from '@/components/Shell';
import { HomePage } from '@/pages/HomePage';
import { StudentsPage, EventsPage, ContactPage } from '@/pages/BasicPages';
import { ArchiveLanding, CategoryPage, SubsectionPage } from '@/components/Archive';
import { AdminPage } from '@/pages/AdminPage';

function App(){const path=window.location.pathname.replace(/\/$/,'')||'/';let content:React.ReactNode;if(path==='/')content=<HomePage/>;else if(path==='/students')content=<StudentsPage/>;else if(path==='/events')content=<EventsPage/>;else if(path==='/contact')content=<ContactPage/>;else if(path==='/nac')content=<ArchiveLanding/>;else if(path==='/admin')content=<AdminPage/>;else if(path.startsWith('/nac/')){const parts=path.split('/').filter(Boolean);const file=Number(parts[1]);content=parts[2]?<SubsectionPage fileNumber={file} subsectionNumber={Number(parts[2])}/>:<CategoryPage fileNumber={file}/>;}else content=<ArchiveLanding/>;return path==='/admin'?content:<Shell>{content}<Footer/></Shell>}
export default App;
