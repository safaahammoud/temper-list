import { mount } from '@vue/test-utils'

import Posts from '@/modules/Posts/views/Posts.vue';
import PostMovementHistory from '@/modules/Posts/components/PostMovementHistory.vue';
import mockedPosts from '@/mocks/posts.json';
import { getPosts } from '@/modules/Posts/repository/posts.repository';

const mountComponent = async () => {
  const wrapper = await mount(Posts);

  return wrapper;
};

jest.mock('@/modules/Posts/repository/posts.repository');

describe('Posts.vue', () => {
  beforeEach(() => {
    (getPosts as jest.Mock)
      .mockImplementation(() => Promise.resolve(mockedPosts));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('on initialization', () => {
    it(`should display posts`, async () => {
      // Arrange

      // Act
      const wrapper = await mountComponent();

      // Assert
      expect(wrapper.vm.posts).toHaveLength(wrapper.vm.maxDisplayPostCount);
    });
  });

  describe('time travel functionality', () => {
    it(`should revert movement of post when user clicks on time travel button`, async () => {
      // Arrange
      const firstPost = mockedPosts[0];
      const actionsList = [{
        newIndex: 1,
        oldIndex: 0,
        postDetails: firstPost,
      }];

      // Act
      const wrapper = await mountComponent();

      wrapper.vm.actionsList = [...actionsList];
      await wrapper.vm.$nextTick();

      let postMovementListHistory = wrapper.findComponent(PostMovementHistory);

      postMovementListHistory.vm.$emit('time-travel-btn-click');

      const firstPostTimeTravelButton = wrapper.find('.time-travel-button');
      const postOldIndex = wrapper.vm.actionsList[0].oldIndex;

      await firstPostTimeTravelButton.trigger('click');

      // Assert
      expect(wrapper.vm.posts.indexOf(firstPost)).toEqual(postOldIndex);
    });
  });
});
