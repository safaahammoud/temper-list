import { Direction } from "@/enums/Direction.enum";

export type PostAPI = {
  id: number;
  body: string;
  title: string;
  userId: number;
}

export type MovedPostDetails = {
  index: number;
  direction: Direction;
  postDetails: PostAPI;
}

export type PostMovementAction = {
  newIndex: number;
  oldIndex: number;
  currentIndex?: number;
  postDetails: PostAPI;
}
