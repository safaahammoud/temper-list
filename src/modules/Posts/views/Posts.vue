<template>
  <template v-if="isLoading">
    {{ postsLoadingMessage }}
  </template>

  <template v-else>
    <template v-if="error.message">
      {{ error.message || error.defaultMessage }}
    </template>

    <template v-else>
      <div class="flex flex-wrap p-10">
        <div class="w-full md:w-1/2 pr-10">
          <template v-if="posts.length">
            <h1 class="mb-10">
              {{ postListTitle }}
            </h1>

            <TransitionGroup name="list" tag="ul">
              <li
                v-for="(post, index) in posts"
                :key="post.id"
              >
                <div class="flex justify-between px-6 py-4 max-w-sm rounded overflow-hidden shadow-lg mb-6">
                  <div class="font-bold text-xl mb-2">{{ post.title }}</div>

                  <div class="flex flex-col items-center justify-center">
                    <span
                      v-if="index !== 0"
                      @click="movePostAndFillMovementDetails({
                        index,
                        postDetails: post,
                        direction: Direction.UP,
                      })"
                      class="cursor-pointer"
                    >&#8963;</span>

                    <span
                      v-if="index !== posts.length - 1"
                      class="cursor-pointer"
                      @click="movePostAndFillMovementDetails({
                        index,
                        postDetails: post,
                        direction: Direction.DOWN,
                      })"
                    >&#8964;</span>
                  </div>
                </div>
              </li>
            </TransitionGroup>
          </template>

          <template v-else>
            {{ emptyStateMessage }}
          </template>
        </div>

        <div
          v-if="actionsList.length"
          class="w-full md:w-1/2"
        >
          <PostMovementHistory
            :actions-list="actionsList"
            :title="postMovementListTitle"
            @time-travel-btn-click="onTimeTravelBtnClick($event)"
          />
        </div>
      </div>
    </template>
  </template>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { Direction } from '@/enums/Direction.enum';

import PostMovementHistory from '../components/PostMovementHistory.vue';
import { PostAPI, PostMovementAction, MovedPostDetails } from '../types/post.type';
import { getPosts } from '../repository/posts.repository';

export default defineComponent({
  name: 'PostsView',

  components: {
    PostMovementHistory,
  },

  data: () => ({
    Direction,
    isLoading: false,
    maxDisplayPostCount: 5,
    posts: [] as PostAPI[],
    actionsList: [] as PostMovementAction[],
    postCardFirstActions: [] as PostMovementAction[],
    postListTitle: 'Sortable Post list',
    postMovementListTitle: 'List of actions commited',
    emptyStateMessage: 'No posts available',
    postsLoadingMessage: 'Fetching posts...',
    error: {
      message: '',
      defaultMessage: 'Error Occurred, please try later',
    },
  }),

  computed: {
    formattedMovementActions(): PostMovementAction[] {
      return this.postCardFirstActions.map((action: PostMovementAction) => {
        const currentIndex = this.posts.indexOf(action.postDetails);

        return {
          ...action,
          currentIndex: currentIndex,
        };
      });
    },
  },

  async mounted(): Promise<void> {
    this.isLoading = true;

    const posts = await getPosts()
      .catch((error) => {
        this.error = {
          ...this.error,
          message: error.message,
        };

        throw Error(error);
      });

    this.isLoading = false;
    this.posts = posts.slice(0, this.maxDisplayPostCount);
  },

  methods: {
    addPostMovementDetailsToListOfActions(
      { postDetails, newIndex, oldIndex }: PostMovementAction
    ): void {
      this.actionsList = [
        {
          newIndex,
          oldIndex,
          postDetails,
        },
        ...this.actionsList,
      ];
    },

    onTimeTravelBtnClick(cardIndex: number): void {
      this.postCardFirstActions = [];

      const currentAndPreviousCardsActions = this.actionsList.slice(0, cardIndex + 1).reverse();
      const actionCardsIds = (
        new Set(
          (currentAndPreviousCardsActions.map((action: PostMovementAction) => action.postDetails.id))
        )
      );

      actionCardsIds.forEach((actionCardId: number) => {
        const movementAction = currentAndPreviousCardsActions.find((action: PostMovementAction) => (
          action.postDetails.id === actionCardId
        ));

        this.postCardFirstActions.push(movementAction as PostMovementAction);
      });

      this.revertPostMovements(cardIndex);
    },

    revertPostMovements(cardIndex: number): void {
      this.formattedMovementActions.reverse()
        .forEach(({ oldIndex, currentIndex = 0 }: PostMovementAction) => (
          this.changePostPosition(currentIndex, oldIndex)
        ));

      this.actionsList.splice(0, cardIndex + 1);
    },

    changePostPosition(currentIndex: number, toIndex: number): void {
      const postToBeMoved = this.posts.splice(currentIndex, 1)[0];

      this.posts.splice(toIndex, 0, postToBeMoved);
    },

    movePostAndFillMovementDetails(
      { index: postIndex, direction, postDetails }: MovedPostDetails,
    ): void {
      let toIndex = 0;

      if (direction === Direction.UP) {
        toIndex = postIndex - 1;
      } else if (direction === Direction.DOWN) {
        toIndex = postIndex + 1;
      }

      this.addPostMovementDetailsToListOfActions({
        newIndex: toIndex,
        oldIndex: this.posts.indexOf(postDetails),
        postDetails,
      });

      this.changePostPosition(postIndex, toIndex);
    }
  }
});
</script>

<style lang="scss">
  .list-move {
    transition: all 0.5s ease;
  }
</style>
