import { Text } from 'react-native';

import { styles } from '@/styles/home.styles';

type Props = {
  greeting: string;
  formattedDate: string;
};

const HomeHeader = ({ greeting, formattedDate }: Props) => {
  return (
    <>
      <Text style={styles.greeting}>{greeting}</Text>

      <Text style={styles.sectionLabel}>{formattedDate}</Text>
    </>
  );
};

export default HomeHeader;
