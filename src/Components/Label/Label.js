import styled from "styled-components";


const Label = styled.label`
    font-size = ${props => props.font_size || '16px'};
    color = ${props => props.color || 'black'};
`

export default Label