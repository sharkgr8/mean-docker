import { IFlowFile } from 'flowjs';

export interface IshFile extends IFlowFile {
  isUploaded: boolean;
}
