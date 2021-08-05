import { PortableWifiOffSharp } from "@material-ui/icons";
import React from "react";
import styled from "styled-components";

const Button = ({
  width,
  height,
  bg,
  color,
  padding,
  margin,
  fontsize,
  _onClick,
  text,
  border,
  children,
}) => {
  const styles = {
    width,
    height,
    bg,
    color,
    padding,
    margin,
    border,
    fontsize,
  };
  return (
    <ElButton onClick={_onClick} {...styles}>
      {text ? text : children}
    </ElButton>
  );
};

Image.defaultProps = {
  children: null,
  width: false,
  height: false,
  color: false,
  padding: false,
  bg: false,
  text: false,
  fontsize: false,
  border: false,
  margin: false,
  _onClick: () => {},

  type: "",
};

export default Button;

const ElButton = styled.button`
  width: ${(props) => (props.width ? props.width : "auto")};
  height: ${(props) => (props.height ? props.height : "auto")};
  margin: ${(props) => (props.margin ? props.margin : "auto")};
  border: ${(props) =>
    props.border ? `2px solid ${props.theme.colors[props.border]};` : "none"};
  padding: ${(props) => (props.padding ? props.padding : "auto")};
  background-color: ${(props) =>
    props.bg ? props.theme.colors[props.bg] : props.theme.colors.mainGreen};
  color: ${(props) =>
    props.color ? props.theme.colors[props.color] : props.theme.colors.white};
  font-size: ${(props) =>
    props.fontsize
      ? props.theme.fontSizes[props.fontSizes]
      : props.theme.fontSizes.md};
  border-radius: 8px;
  text-align: center;
  font-weight: bold;
`;
