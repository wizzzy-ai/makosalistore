import React from 'react'
import {
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  FormControl,
  FormLabel,
  Select,
  Stack,
  Checkbox,
} from "@chakra-ui/react"
import { getApplicableFilterAttributes } from '../constants/taxonomy'

const Filter = ({ classac = '', categoryLabel }) => {
  const attributes = getApplicableFilterAttributes(categoryLabel)

  return (
    <div className={`filterarea ${classac}`}>
      <div className='sortbydiv'>
        <h1> Sort By</h1>
        <ul>
          <li className='lined'>Default</li>
          <li className='lined'>Rating</li>
          <li className='lined'>Date</li>
          <li className='lined'>Low to high price</li>
          <li className='lined'>high to low price</li>
        </ul>
      </div>

      <div className='pricediv'>
        <h1> Price</h1>
        <FormControl id="price_from">
          <FormLabel>From :</FormLabel>
          <NumberInput bg='white' borderRadius="md">
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
        <FormControl id="price_to">
          <FormLabel>To :</FormLabel>
          <NumberInput bg='white' borderRadius="md">
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </FormControl>
      </div>

      {attributes.length > 0 && (
        <div className='attribute-filters'>
          <h1>Attributes</h1>
          <FormControl>
            {attributes.map((attr) => {
              if (attr.key === 'condition') {
                return (
                  <React.Fragment key={attr.key}>
                    <FormLabel fontSize="sm">Condition</FormLabel>
                    <Stack direction="row" spacing={4}>
                      {attr.values.map((label) => (
                        <Checkbox key={label} colorScheme="teal">
                          {label}
                        </Checkbox>
                      ))}
                    </Stack>
                  </React.Fragment>
                )
              }

              return (
                <React.Fragment key={attr.key}>
                  <FormLabel fontSize="sm">{attr.label}</FormLabel>
                  <Select placeholder={`Select ${attr.label.toLowerCase()}`} size="sm" bg="white">
                    {attr.values.map((label) => (
                      <option key={label} value={label}>
                        {label}
                      </option>
                    ))}
                  </Select>
                </React.Fragment>
              )
            })}
          </FormControl>
        </div>
      )}

      <div className='colorsdiv'>
        <h1> Color</h1>
        <div className="col" style={{ backgroundColor: 'black' }}></div>BLACK<br />
        <div className="col" style={{ backgroundColor: 'white' }}></div>WHITE<br />
        <div className="col" style={{ backgroundColor: 'red' }}></div>RED<br />
        <div className="col" style={{ backgroundColor: 'blue' }}></div>BLUE<br />
        <div className="col" style={{ backgroundColor: 'grey' }}></div>GRY<br />
      </div>

    </div>
  )
}

export default Filter
