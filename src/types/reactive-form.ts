
import type { Handler, InputType, Status, ValidationErrors } from 'react-reactive-form';

/**
 * @description the Meta interface of the reactive-forms. Not exported from the package
 */
export interface ReactiveFormMeta {
  value: any;
  touched: boolean;
  untouched: boolean;
  disabled: boolean;
  enabled: boolean;
  invalid: boolean;
  valid: boolean;
  pristine: boolean;
  dirty: boolean;
  errors: ValidationErrors;
  status: Status;
  pending: boolean;
  _pendingValue: any;
  hasError: (errorCode: string, path?: string|number[]|string) => boolean;
  getError: (errorCode: string, path?: string|number[]|string) => any;
  handler: (inputType?: InputType, value?: string) => Handler;
}

export interface FormMeta extends Record<string, unknown> {
  name: string;
  label?: string;
  subtitle?: string;
  placeholder?: string;
  maxLength?: number;
  autoRemove?: RegExp;
  isVisible?: boolean;
  autoFocus?: boolean;
  autoComplete?: string;
  type?: string;
  newItemText?: string;
}

export interface FormOptions {
  validators?: { name: string }[];
}

export interface ParentType { meta: { updateIncident: (data: any) => void }}

type ReactiveFormPickedProps = 'handler' | 'touched' | 'hasError' | 'getError';
export interface FormInputProps<T = string> extends Pick<ReactiveFormMeta, ReactiveFormPickedProps> {
  meta?: FormMeta;
  validatorsOrOpts?: FormOptions;
  parent: ParentType;
  value: T;
}
