import styled from "styled-components"

const Input = styled.input`
    width: ${props => props.width || "100%"};
    padding: ${props => props.padding || "0px 0px"};
    margin: ${props => props.margin || '0px 0px'};
    border: ${props => props.border || '0px'};
    border-radius: ${props => props.border_radius || '0px'};
    text-align:${props => props.text_align || "center"};
    font-size: ${props => props.font_size || '14px'}
`

export default Input