import {Grid} from '@mui/material';
import {useSelector} from 'react-redux';
import {getUserAuthData} from '@entities/User/model/selectors.ts';
import {UserValueBlock} from '@pages/ProfilePage/ui/UserValueBlock.tsx';

export const UserValueBlocks = () => {
	const authData = useSelector(getUserAuthData);

	return (
		<>
			<Grid container spacing={1} direction={'row'} sx={{textAlign: 'center'}}>
				<Grid size={3}>
					<UserValueBlock title={'Рост:'} value={authData?.height} valueType={'см'}/>
				</Grid>
				<Grid size={3}>
					<UserValueBlock title={'Вес:'} value={authData?.weight} valueType={'кг'}/>
				</Grid>
				<Grid size={3}>
					<UserValueBlock title={'ИМТ:'} value={authData?.imt} valueType={'норма'}/>
				</Grid>
				<Grid size={3}>
					<UserValueBlock title={'ЖИР:'} value={authData?.fat} valueType={'%'}/>
				</Grid>
			</Grid>
		</>
	);
};
