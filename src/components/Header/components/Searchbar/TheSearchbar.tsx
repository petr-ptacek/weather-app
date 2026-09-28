import type { Props }    from "./types";
import { useController } from "./useController.ts";

export function TheSearchbar(props: Props) {
  const {
    rootEl,
    handleInputFocus,
    query,
    handleInputChange,
    popoverVisible,
    options,
    handleSelectOption,
    popoverMessage,
    optionsVisible
  } = useController({ props });


  return (
    <div className="searchbar" ref={ rootEl }>
      <svg className="icon searchbar__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
        <path d="M0 0h24v24H0z" fill="none" />
        <path
          fill="currentColor"
          d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5A6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5S14 7.01 14 9.5S11.99 14 9.5 14" />
      </svg>

      <input
        value={ query }
        type="search"
        className="searchbar__input"
        autoComplete="off"
        placeholder="Lokace"
        onChange={ handleInputChange }
        onFocus={ handleInputFocus }
      />

      {
        popoverVisible &&
        (
          <div className="searchbar__popover">
            { popoverMessage &&
              (
                <div className="searchbar__message">
                  { popoverMessage }
                </div>
              )
            }

            {
              optionsVisible &&
              (
                <ul className="searchbar__options">
                  {
                    options.map(option => {
                      return (
                        <li key={ option.id }>
                          <button
                            type="button"
                            className="searchbar__option"
                            onClick={ () => handleSelectOption(option) }
                          >
                            <span>{ option.name }</span>
                            <span className="searchbar__option-meta"> { option.state ?? option.country }</span>
                          </button>
                        </li>
                      );
                    })
                  }
                </ul>
              )
            }
          </div>
        )
      }
    </div>
  );
}