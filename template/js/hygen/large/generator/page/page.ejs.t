---
to: "<%= `src/app/${url}/page.jsx` %>"
---
import { Screen } from '@/components/page/<%= name %>'

const <%= name %> = () => <Screen />;

export default <%= name %>;