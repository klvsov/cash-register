import { FC } from 'react';
import cls from 'classnames';
import styles from './Toggler.module.scss';

interface TogglerProps {
  isOn: boolean;
  handleToggle: (checked: boolean) => void;
}

const Toggler: FC<TogglerProps> = ({ isOn, handleToggle }) => {
  return (
    <>
      <input
        checked={isOn}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          handleToggle(event.target.checked)
        }
        className={styles.react_switch_checkbox}
        id={`reactSwitchNew`}
        type="checkbox"
      />
      <label
        className={cls(styles.react_switch_label, {
          [styles.background]: isOn,
        })}
        htmlFor={`reactSwitchNew`}
      >
        <span className={styles.react_switch_button} />
      </label>
    </>
  );
};

export default Toggler;
