import styled from 'styled-components';

export const Switch = styled.div`
  font-family: "Lato", Tahoma, Verdana, sans-serif;
  position: relative;
  height: 26px;
  /*width: 135px;*/
  width: 153px;
  background-color: #e4e4e4;
  border-radius: 6px;
  border: 2px solid #3F3D36;
  box-sizing: content-box;
  margin-top: 12px;
  margin-left: 10px;
`;

export const SwitchSelection = styled.span`
  display: block;
  position: absolute;
  z-index: 1;
  top: 0px;
  left: 0px;
  /*width: 45px;*/
  width: 49px;
  height: 24px;
  background: #547679;
  border-radius: 3px;
  border: 1px solid #3F3D36;
  transition: left 0.25s ease-out;
`;

export const SwitchLabel = styled.label`
  position: relative;
  z-index: 2;
  float: left;
  width: 45px;
  line-height: 26px;
  font-size: 11px;
  color: rgba(0, 0, 0, 0.6);
  text-align: center;
  cursor: pointer;
  padding: 0 3px;
`;

export const SwitchRadio = styled.input`
  display: none;

  &:checked + ${SwitchLabel} {
    transition: 0.15s ease-out;
    /*color: #fff;*/
  }
`;
