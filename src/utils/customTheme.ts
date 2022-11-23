import {
  extendTheme,
  InputProps,
  TableCellProps,
  TableColumnHeaderProps,
  ThemeConfig,
} from '@chakra-ui/react';

export const colors = {
  customGreen: '#07B89E',
  brightCustomGreen: '#00c6a7',
  lightCustomGreen: '#07b89e85',
  lighterCustomGreen: '#83DBCF',
  customGreyGreen: '#0b7157',
  customGrey: '#494949',
  redError: '#FF0000',
};

const theme = {
  styles: {
    global: {
      body: {
        fontFamily: "'Montserrat', sans-serif",
      },
    },
  },
  components: {
    Switch: {
      variants: {
        timeDriverGreenBlack: {
          track: {
            bg: '#434343',
            p: '3px',
            _checked: {
              bg: 'customGreen',
            },
          },
          thumb: {
            bg: 'white',
            _checked: {
              bg: '#000000',
            },
          },
        },
        timeDriverGreen: {
          track: {
            bg: 'customGreen',
            p: '0.23rem',
            _checked: {
              bg: 'customGreen',
            },
          },
          thumb: {
            bg: 'white',
            _checked: {
              bg: '#000000',
            },
          },
        },
      },
    },
    Button: {
      variants: {
        timeDriverGreen: {
          bg: 'linear-gradient(359.92deg, #07B89E 12.86%, #17E3B0 47.09%, #07B89E 99.93%);',
          color: 'black',
          fontWeight: 'bold',
          boxShadow: '0px 15px 15px rgba(7, 184, 158, 0.25);',
          borderRadius: '15px',
          fontFamily: "'BebasNeue', sans-serif",
          letterSpacing: '1px',
          wordSpacing: '1.5px',
          fontSize: '18px',
          lineHeight: '18px',
          _hover: {
            bg: 'linear-gradient(359.92deg, #07B89E 12.86%, #17E3B0 47.09%, #07B89E 99.93%);',
            opacity: '0.9',
            _disabled: {
              bg: 'linear-gradient(359.92deg, #07B89E 12.86%, #17E3B0 47.09%, #07B89E 99.93%);',
              opacity: '0.4',
            },
          },
          _active: { opacity: '0.9' },
        },
        timeDriverBlack: {
          bg: 'linear-gradient(0deg, #000000 -3.85%, #231F20 46.83%, #000000 101.92%), #FFFFFF;',
          color: 'white',
          fontWeight: 'bold',
          boxShadow: '0px 5px 5px rgba(0, 0, 0, 0.35)',
          borderRadius: '15px',
          fontFamily: "'BebasNeue', sans-serif",
          letterSpacing: '1px',
          wordSpacing: '1.5px',
          fontSize: '18px',
          lineHeight: '18px',
          _hover: {
            bg: 'linear-gradient(0deg, #000000 -3.85%, #231F20 46.83%, #000000 101.92%), #FFFFFF;',
            opacity: '0.97',
            _disabled: {
              bg: 'linear-gradient(0deg, #000000 -3.85%, #231F20 46.83%, #000000 101.92%), #FFFFFF;',
              opacity: '0.8',
            },
          },
          _disabled: {
            bg: 'linear-gradient(0deg, #000000 -3.85%, #231F20 46.83%, #000000 101.92%), #FFFFFF;',
            opacity: '0.65',
          },
          _active: { opacity: '0.9' },
        },
      },
    },
    Input: {
      variants: {
        tableInput: {
          field: {
            border: 0,
            borderRadius: 0,
            bg: 'inherit',
            m: 0,
            fontWeight: 'semibold',
            fontSize: 'sm',
            _placeholder: {
              opacity: 1,
            },
            _invalid: {
              zIndex: 1,
              border: '1px solid',
              borderColor: 'red.500',
              boxShadow: `0 0 0 1px #E53E3E`,
            },
          },
        },
      },
    },
    Textarea: {
      variants: {
        tableInput: {
          border: 0,
          borderRadius: 0,
          bg: 'inherit',
          fontWeight: 'semibold',
          fontSize: 'sm',
          _placeholder: {
            opacity: 1,
          },
          _invalid: {
            zIndex: 1,
            border: '1px solid',
            borderColor: 'red.500',
            boxShadow: `0 0 0 1px #E53E3E`,
          },
        },
      },
    },
    Select: {
      variants: {
        tableInput: {
          field: {
            border: 0,
            borderRadius: 0,
            bg: 'inherit',
            m: 0,
            paddingInlineStart: '16px',
            '-mozPaddingStart': '12px',
            fontWeight: 'semibold',
            fontSize: 'sm',
            _disabled: {
              cursor: 'not-allowed',
            },
            _invalid: {
              zIndex: 1,
              border: '1px solid',
              borderColor: 'red.500',
              boxShadow: `0 0 0 1px #E53E3E`,
            },
          },
        },
      },
    },
    Checkbox: {
      variants: {
        tableCheckbox: {
          control: {
            borderRadius: 'full',
            border: '1px solid',
            borderColor: 'black',
            _checked: {
              backgroundColor: 'black',
              _hover: {
                backgroundColor: 'blackAlpha.700',
              },
            },
            backgroundColor: 'white',
          },
        },
      },
    },
  },
  colors,
  // By doing so, if the user access a page that use chakra ui with dark theme
  // We will automatically change it to light theme
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false,
  } as ThemeConfig,
};

export const tableHeaderStyle: TableColumnHeaderProps = {
  bg: '#83dbcf',
  border: '1px solid black',
  fontFamily: 'Montserrat',
  textAlign: 'center',
  textTransform: 'unset',
  padding: 0,
};

export const tableDataStyle: TableCellProps = {
  border: '1px solid black',
  textAlign: 'center',
  fontWeight: 'semibold',
};

export const searchInputStyle: InputProps = {
  variant: 'tableInput',
  _placeholder: {
    opacity: 1,
    color: 'gray.800',
    fontWeight: 'bold',
    fontSize: '0.78rem',
    fontFamily: 'Montserrat',
    letterSpacing: 'wider',
  },
  color: 'gray.800',
  fontWeight: 'bold',
  fontSize: '0.78rem',
  fontFamily: 'Montserrat',
  letterSpacing: 'wider',
};

export const authInputStyle: InputProps = {
  variant: 'flushed',
  borderColor: 'lightCustomGreen',
  borderBottomWidth: '2px',
  _focus: {
    borderColor: 'customGreen',
  },
  fontSize: '14px',
  fontFamily: 'Montserrat',
  fontWeight: 'semibold',
  px: '0.5rem',
  _placeholder: {
    color: 'whiteAlpha.600',
  },
};

export const tableTitleStyle: TableCellProps = {
  border: '1px solid black',
  textAlign: 'center',
  bg: '#83dbcf',
  py: 0,
  fontSize: 'xs',
  fontWeight: 'bold',
  lineHeight: 4,
};

export const chakraColor = (color: string, variant?: string) =>
  `var(--chakra-colors-${color}${variant ? `-${variant}` : ''})`;

export const chakraSpace = (type: string | number) => `var(--chakra-space-${type})`;

export default extendTheme(theme);
