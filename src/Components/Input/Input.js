import styled from "styled-components"

const Input = styled.input`
    width: ${props => props.width || "100%"};
    padding: ${props => props.padding || "0px 0px"};
    margin: ${props => props.margin || '0px 0px'};
    border: ${props => props.border};
    border-radius: ${props => props.borderRadius};
    text-align:${props => props.textAlign || "center"};
    font-size: ${props => props.fontSize || '14px'}
`

export default Input