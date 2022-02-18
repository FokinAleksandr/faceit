import styled from '@emotion/native';
import React from 'react';
import { Image, Pressable, RefreshControl, Text } from 'react-native';
import { Provider } from 'react-redux';

import { usePost, usePosts, useUser } from '~/src/apiHooks';
import { colors } from '~/src/colors';
import backIcon from '~/src/icons/backIcon/backIcon.png';
import { goBack, navigate, ScreenResolver, useScreenParams } from '~/src/navigation';
import { reduxStore, useAppDispatch } from '~/src/reduxStore';

export function App() {
  return (
    <Provider store={reduxStore}>
      <StyledSafeAreaView>
        <ScreenResolver />
      </StyledSafeAreaView>
    </Provider>
  );
}

export function FeedScreen() {
  const { data, status, refetch } = usePosts();
  const dispatch = useAppDispatch();
  const [isRefreshing, setRefreshStatus] = React.useState(false);

  if (status === 'loading') {
    return <Text>loading...</Text>;
  }

  if (status === 'error' || !data) {
    return <Text>Unknown error occurred</Text>;
  }

  const handleRefresh = () => {
    setRefreshStatus(true);
    refetch().finally(() => setRefreshStatus(false));
  };

  return (
    <StyledScrollView
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
    >
      {data.map(({ body, title, id, userId }) => (
        <StyledPost
          key={id}
          onPress={() => dispatch(navigate({ screen: 'Post', params: { postId: id, userId } }))}
        >
          <StyledPostTitle>{title}</StyledPostTitle>
          <Text>{body.length > 100 ? body.slice(0, 100).replace('\n', '') + '...' : body}</Text>
        </StyledPost>
      ))}
    </StyledScrollView>
  );
}

export function PostScreen() {
  const params = useScreenParams('Post');
  const user = useUser(params?.userId);
  const post = usePost(params?.postId);
  const dispatch = useAppDispatch();

  const renderPost = () => {
    if (post.status === 'loading') {
      return <Text>loading...</Text>;
    }

    if (post.status === 'error' || !post.data) {
      return <Text>Unknown error occurred</Text>;
    }

    return (
      <StyledPost>
        <StyledPostTitle>{post.data.title}</StyledPostTitle>
        <Text>{post.data.body}</Text>
      </StyledPost>
    );
  };

  const renderUser = () => {
    if (user.status === 'loading') {
      return <Text>loading...</Text>;
    }

    if (user.status === 'error' || !user.data) {
      return <Text>Unknown error occurred</Text>;
    }

    const userId = user.data.id;
    return (
      <Pressable onPress={() => dispatch(navigate({ screen: 'User', params: { userId } }))}>
        <StyledUserWrapper>
          <StyledAvatar source={{ uri: user.data.avatarUrl }} />
          <StyledUserName>{user.data.name}</StyledUserName>
        </StyledUserWrapper>
      </Pressable>
    );
  };

  return (
    <StyledWrapper>
      <Pressable onPress={() => dispatch(goBack())}>
        <Image source={backIcon} />
      </Pressable>
      {renderUser()}
      {renderPost()}
    </StyledWrapper>
  );
}

export function UserScreen() {
  const params = useScreenParams('User');
  const user = useUser(params?.userId);
  const dispatch = useAppDispatch();

  return (
    <StyledWrapper>
      <Pressable onPress={() => dispatch(goBack())}>
        <Image source={backIcon} />
      </Pressable>
      <Text>{JSON.stringify(user.data)}</Text>
    </StyledWrapper>
  );
}

const StyledUserWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  margin: 24px 0;
`;

const StyledAvatar = styled.Image`
  width: 96px;
  height: 96px;
  border-radius: 12px;
`;

const StyledUserName = styled.Text`
  margin-left: 12px;
  font-weight: bold;
  font-size: 16px;
`;

const StyledSafeAreaView = styled.SafeAreaView`
  flex: 1;
`;

const StyledWrapper = styled.View`
  background-color: white;
  flex: 1;
  padding: 0 24px;
`;

const StyledScrollView = styled.ScrollView`
  flex: 1;
  padding: 0 24px;
`;

const StyledPostTitle = styled.Text`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 4px;
`;

const StyledPost = styled.Pressable`
  align-content: center;
  justify-content: center;
  border-width: 1px;
  border-color: ${colors.someColor};
  border-radius: 16px;
  margin-bottom: 16px;
  padding: 12px;
`;
