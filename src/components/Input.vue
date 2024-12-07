<template>
    <div :class="[$style.wrapper, containerClass ?? '']">
        <input ref="inputEl" :style="inputStyle" :value="value" v-on="validationListeners" v-bind="attrs" :class="{
            [$style.invalid]: errorMessage || showError,
            [$style.inputNumber]: attrs.type === 'number',
            [$style.input]: true,
            [$style.doNotShow]: attrs.hidden,
            [$style.primary]: variant === 'primary',
            [$style.secondary]: variant === 'secondary',
            [$style.warning]: variant === 'warning',
            [$style.success]: variant === 'success',
            [$style.danger]: variant === 'danger',
            [$style.info]: variant === 'info',
            [$style.floatingInput]: useFloatingLabel,
            [$style.checkbox]: isCheckbox,
            [$style.floatingCheckbox]: useFloatingLabel && isCheckbox,
            [$style.radio]: isCheckbox && attrs.type === 'radio',
        }" />
        <Label :for="attrs.id" v-if="!hideLabel" :required="attrs.required" :disabled="attrs.disabled" :class="{
            [$style.inputLabel]: true,
            [$style.floatingLabel]: useFloatingLabel,
        }">
            {{ attrs.placeholder }} </Label><template v-else />
    </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { type GenericObject, useField, type FieldOptions } from "vee-validate";
import type { Schema } from "yup";
import type { InputHTMLAttributes } from "vue";
import invalidIcon from "@/assets/images/Invalid.svg";
import { useAttrs } from "vue";
import { ref } from "vue";

export type Variant = "primary" | "secondary" | "info" | "danger" | "warning" | "success";
export type ValidClass = string | string[] | GenericObject | GenericObject[];
export interface InputProps extends /* @vue-ignore */ InputHTMLAttributes {
    schema?: Schema;
    inputName: string;
    checkedValue?: string | number | boolean;
    uncheckedValue?: string | number | boolean;
    containerClass?: ValidClass;
    showError?: boolean;
    hideLabel?: boolean;
    useFloatingLabel?: boolean;
    variant?: Variant | "default";
}
export interface InputEmitEvent extends InputEvent {
    target: HTMLInputElement;
}
export interface ChangeEmitEvent extends InputEvent {
    target: HTMLInputElement;
}
export interface FocusEmitEvent extends FocusEvent {
    target: HTMLInputElement;
}
export type InputEmit = {
    change: [e: InputEmitEvent];
    input: [e: InputEmitEvent];
    blur: [e: FocusEmitEvent];
};

const emit = defineEmits<InputEmit>();
const inputEl = ref<HTMLInputElement>();
const _attrs = useAttrs() as InputHTMLAttributes;
const _props = withDefaults(defineProps<InputProps>(), {
    useFloatingLabel: true,
    variant: "primary",
});
const props = _props as Omit<typeof _props, keyof InputHTMLAttributes>;

const type = computed(() => _attrs.type ?? "text");
const isCheckbox = computed(() => ["radio", "checkbox"].includes(type.value));
const attrs = computed(() => ({ ..._attrs, name: props.inputName, type: type.value }));

const veeValidateOptions: FieldOptions = {
    validateOnValueUpdate: false,
    checkedValue: isCheckbox.value ? props.checkedValue : undefined,
    uncheckedValue: isCheckbox.value ? props.uncheckedValue : undefined,
    type: isCheckbox.value ? (type.value as "default") : "default",
};

const validationListeners: Record<string, (...args: any) => any> = {
    blur: (evt: FocusEmitEvent) => {
        handleBlur(evt, true);
        emit("blur", evt);
    },
};

if (isCheckbox.value) {
    validationListeners.change = (evt: InputEmitEvent) => {
        handleChange(evt);
        emit("change", evt);
    };
}
if (!isCheckbox.value) {
    validationListeners.input = (evt: InputEmitEvent) => {
        const target = evt.target;
        target.value = target.value.trimStart().replace(/\s+/g, " ");
        handleChange(evt, !!errorMessage.value);
        emit("input", evt);
    };
}

/** Vee validate */
const { value, errorMessage, checked, handleBlur, handleChange, setValue, resetField } = useField(
    props.inputName,
    props.schema,
    veeValidateOptions
);
const inputStyle = computed(() => ({
    backgroundImage: !isCheckbox.value
        ? !!errorMessage.value || props.showError
            ? `url('${invalidIcon}')`
            : ""
        : "",
}));

defineOptions({ inheritAttrs: false });
defineExpose({
    value,
    checked,
    inputEl,
    setValue,
    handleChange,
    resetField,
    handleBlur,
});
</script>

<style module lang="postcss">
.wrapper {
    @apply flex items-center flex-col-reverse relative;
}

.input {
    @apply text-inherit text-[.875rem] w-full px-3 py-2 font-normal border rounded-md outline-none appearance-none;
    @apply transition-[border-color, _box-shadow, _opacity] motion-reduce:transition-none bg-[length:0_0];
    @apply placeholder-primary-dark-500 disabled:opacity-50 disabled:cursor-not-allowed;

    @apply border-primary-dark-300 bg-primary-dark-50 bg-clip-padding;
    @apply dark:border-primary-dark-700 dark:bg-primary-dark-800;
    @apply focus:ring-4 focus:ring-transparent focus:ring-offset-0 focus:outline-none active:outline-0;

    @apply hover:[&:not(:disabled):not(.invalid)]:border-primary-dark-400;
    @apply dark:hover:[&:not(:disabled):not(.invalid)]:border-primary-dark-800;

    @apply focus:border-primary-dark-400 focus:ring-primary-dark-300;
    @apply dark:focus:border-primary-dark-800 dark:focus:ring-primary-dark-900;
}

.input:disabled+.inputLabel {
    @apply opacity-50;
}

.invalid {
    @apply hover:[&:not(:disabled)]:border-danger-600;
    @apply dark:hover:[&:not(:disabled)]:border-danger-700;

    @apply focus:border-danger-600 focus:ring-danger-200;
    @apply dark:focus:border-danger-700 dark:focus:ring-danger-950;

    @apply bg-no-repeat pr-[calc(1.5em_+_0.75rem)];
    @apply border-danger-600 dark:border-danger-700;
    @apply bg-[right_calc(0.375em_+_0.1875rem)_center];
    @apply bg-[length:calc(0.75em_+_0.375rem)_calc(0.75em_+_0.375rem)];
}

.input::-webkit-date-and-time-value {
    @apply h-[1.5em];
}

.input::-webkit-contacts-auto-fill-button {
    @apply !absolute !h-0 !w-0 !invisible !right-0 !-z-50;
}

.input::-webkit-autofill {
    @apply bg-transparent;
}

.input::-webkit-auto-fill {
    @apply bg-transparent;
}

.floatingInput {
    @apply h-[calc(3.5rem_+_2px)] leading-[1.25] placeholder-transparent;
    @apply [&:not(:placeholder-shown)]:pt-[1.625rem];
    @apply [&:not(:placeholder-shown)]:pb-[0.625rem];
    @apply [&:not(:-moz-placeholder-shown)]:pt-[1.625rem];
    @apply [&:not(:-moz-placeholder-shown)]:pb-[0.625rem];
    @apply [&:not(:-webkit-autofill)]:pt-[1.625rem];
    @apply [&:not(:-webkit-autofill)]:pb-[0.625rem];
    @apply [&.invalid]:pr-8 focus:pt-[1.625rem] focus:pb-[0.625rem];

    @apply [&:not:moz-placeholder-shown]:peer-[]:opacity-60 [&:not(:-moz-placeholder-shown)_+_label]:scale-[0.85] [&:not(:-moz-placeholder-shown)_+_label]:-translate-y-1.5 [&:not(:-moz-placeholder-shown)_+_label]:translate-x-[0.15rem] [&:not(:placeholder-shown)_+_label]:opacity-60 [&:not(:placeholder-shown)_+_label]:scale-[0.85] [&:not(:placeholder-shown)_+_label]:-translate-y-1.5 [&:not(:placeholder-shown)_+_label]:translate-x-[0.15rem] [&:focus_+_label]:opacity-60 [&:focus_+_label]:scale-[0.85] [&:focus_+_label]:-translate-y-1.5 [&:focus_+_label]:translate-x-[0.15rem] [&:-webkit-autofill_+_label]:opacity-60 [&:-webkit-autofill_+_label]:scale-[0.85] [&:-webkit-autofill_+_label]:-translate-y-1.5 [&:-webkit-autofill_+_label]:translate-x-[0.15rem];
}

.input.checkbox {
    @apply relative w-5 h-5 p-0 [&:not(:disabled)]:cursor-pointer appearance-none;
}

.input.floatingCheckbox {
    @apply h-6 w-6;
}

.checkbox.radio {
    @apply rounded-full;
}

.checkbox:checked {
    @apply after:h-[5px] after:w-[9px] after:border-[2px];
    @apply after:absolute after:top-[4px] after:left-[3px] after:z-[1];
    @apply after:border-t-0 after:border-r-0 after:-rotate-45;
}

.checkbox:checked.floatingInput {
    @apply after:h-[7px] after:w-[12px];
}

.checkbox:checked.radio {
    @apply after:w-2 after:h-2 after:rounded-full after:left-1/2;
    @apply after:-translate-x-1/2 after:-translate-y-1/2 after:top-1/2;
    @apply after:border-none;
}

.checkbox:checked.radio.floatingInput {
    @apply after:w-2.5 after:h-2.5;
}

.checkbox:checked.invalid {
    @apply bg-danger-600 border-danger-600;
    @apply focus:bg-danger-600 focus:border-danger-600;
}

.checkbox:checked.radio.invalid {
    @apply after:bg-danger-100 after:border-danger-100;
}

.inputLabel {
    @apply w-full h-full mb-1;
}

.floatingLabel {
    @apply mb-0 absolute -top-1 left-0 py-5 px-3 overflow-hidden text-start;
    @apply text-ellipsis whitespace-nowrap pointer-events-none border border-transparent border-solid;
    @apply origin-[0_0] transition-[opacity, _transform] delay-100 motion-reduce:transition-none;
}

.inputNumber {
    @apply [-moz-appearance:_textfield];
    @apply [&::-webkit-outer-spin-button]:hidden;
    @apply [&::-webkit-inner-spin-button]:hidden;
    @apply [&::-webkit-inner-spin-button]:m-0;
    @apply [&::-webkit-outer-spin-button]:m-0;
    @apply appearance-none m-0;
}

.doNotShow {
    @apply h-0 w-0 absolute -z-50 invisible opacity-0 pointer-events-none;
}
</style>
