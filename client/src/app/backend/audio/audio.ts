export class Audio {
  _id: string;
  name: string;
  audioFile: AudioFile;
  published: boolean;
  tags: Array<Tag>;
  meta: {
    recordedOn: string,
    recordedAt: string
  };
  created_at: string;
  updated_at: string;
}

export class Tag {
  _id: string;
  tag: string;
  slug: string;
}

export class AudioFile {
  name: string;
  size: string;
  type: string;
}
