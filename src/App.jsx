import { useState } from "react"

function CalculatorButton({ children, onClick, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl p-4 text-xl font-semibold transition ${className}`}
    >
      {children}
    </button>
  )
}

function App() {
  const [display, setDisplay] = useState("0")
  const [firstNumber, setFirstNumber] = useState(null)
  const [operator, setOperator] = useState(null)
  const [waitingForNumber, setWaitingForNumber] = useState(false)
  const [justCalculated, setJustCalculated] = useState(false)

  const calculate = (first, second, operation) => {
    switch (operation) {
      case "+":
        return first + second

      case "-":
        return first - second

      case "×":
        return first * second

      case "÷":
        if (second === 0) return null
        return first / second

      default:
        return second
    }
  }

  // Numbers
  const handleNumber = (number) => {
    if (display === "Error" || justCalculated) {
      setDisplay(number)
      setFirstNumber(null)
      setOperator(null)
      setWaitingForNumber(false)
      setJustCalculated(false)
      return
    }

    if (waitingForNumber) {
      setDisplay(display + number)
      setWaitingForNumber(false)
      return
    }

    setDisplay(display === "0" ? number : display + number)
  }

  // Decimal
  const handleDecimal = () => {
    if (display === "Error" || justCalculated) {
      setDisplay("0.")
      setFirstNumber(null)
      setOperator(null)
      setWaitingForNumber(false)
      setJustCalculated(false)
      return
    }

    if (waitingForNumber) {
      setDisplay(display + "0.")
      setWaitingForNumber(false)
      return
    }

    const currentNumber = getCurrentNumber()

    if (!currentNumber.includes(".")) {
      setDisplay(display + ".")
    }
  }

  // Get the number currently being typed
  const getCurrentNumber = () => {
    if (!operator) {
      return display
    }

    const operatorIndex = display.lastIndexOf(operator)
    return display.slice(operatorIndex + 1)
  }

  // Operators
  const handleOperator = (nextOperator) => {
    if (display === "Error") return

    // Continue from previous answer
    if (justCalculated) {
      const currentValue = Number(display)

      setFirstNumber(currentValue)
      setOperator(nextOperator)
      setDisplay(display + nextOperator)
      setWaitingForNumber(true)
      setJustCalculated(false)

      return
    }

    // Change operator if user presses another operator
    if (waitingForNumber) {
      const lastCharacter = display.slice(-1)

      if (["+", "-", "×", "÷"].includes(lastCharacter)) {
        setDisplay(display.slice(0, -1) + nextOperator)
        setOperator(nextOperator)
      }

      return
    }

    const currentValue = Number(getCurrentNumber())

    if (firstNumber === null) {
      setFirstNumber(currentValue)
    }

    setOperator(nextOperator)
    setDisplay(display + nextOperator)
    setWaitingForNumber(true)
  }

  // Percent
  const handlePercent = () => {
    if (display === "Error" || waitingForNumber) return

    const currentValue = Number(getCurrentNumber())

    if (isNaN(currentValue)) return

    let percentValue

    // + and - use percentage of the first number
    if (
      firstNumber !== null &&
      (operator === "+" || operator === "-")
    ) {
      percentValue = (firstNumber * currentValue) / 100
    } else {
      // × and ÷ convert the current number to decimal percent
      percentValue = currentValue / 100
    }

    const operatorIndex = display.lastIndexOf(operator)

    if (operator) {
      const expression = display.slice(0, operatorIndex + 1)
      setDisplay(expression + String(percentValue))
    } else {
      setDisplay(String(percentValue))
    }

    setWaitingForNumber(false)
  }

  // Equals
  const handleEquals = () => {
    if (
      firstNumber === null ||
      operator === null ||
      display === "Error"
    ) {
      return
    }

    const secondNumber = Number(getCurrentNumber())

    if (isNaN(secondNumber)) return

    const result = calculate(
      firstNumber,
      secondNumber,
      operator
    )

    if (result === null) {
      setDisplay("Error")
      setFirstNumber(null)
      setOperator(null)
      setWaitingForNumber(false)
      setJustCalculated(true)
      return
    }

    setDisplay(String(result))

    // Save result so another operation can continue
    setFirstNumber(result)
    setOperator(null)
    setWaitingForNumber(false)
    setJustCalculated(true)
  }

  // Delete last character
  const handleDelete = () => {
    if (display === "Error" || justCalculated) {
      handleClear()
      return
    }

    if (display.length <= 1) {
      setDisplay("0")
      return
    }

    const newDisplay = display.slice(0, -1)

    // If deleting an operator
    if (["+", "-", "×", "÷"].includes(display.slice(-1))) {
      setOperator(null)
      setWaitingForNumber(false)
    }

    setDisplay(newDisplay)
  }

  // Clear
  const handleClear = () => {
    setDisplay("0")
    setFirstNumber(null)
    setOperator(null)
    setWaitingForNumber(false)
    setJustCalculated(false)
  }

  return (
    <main className="min-h-screen bg-yellow-50 flex items-center justify-center p-5">

      <div className="w-full max-w-md bg-white rounded-2xl border border-yellow-200 shadow-lg p-6">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          My Calculator
        </h1>

        {/* Display */}
        <div className="bg-gray-900 text-white text-right text-3xl rounded-xl p-5 mb-4 min-h-20 flex items-center justify-end break-all">
          {display}
        </div>

        {/* Calculator Buttons */}
        <div className="grid grid-cols-4 gap-3">

          {/* Row 1 */}
          <CalculatorButton
            onClick={handleClear}
            className="bg-red-100 hover:bg-red-200 text-red-600"
          >
            AC
          </CalculatorButton>

          <CalculatorButton
            onClick={handleDelete}
            className="bg-yellow-100 hover:bg-yellow-200"
          >
            DEL
          </CalculatorButton>

          <CalculatorButton
            onClick={handlePercent}
            className="bg-yellow-100 hover:bg-yellow-200"
          >
            %
          </CalculatorButton>

          <CalculatorButton
            onClick={() => handleOperator("÷")}
            className="bg-yellow-300 hover:bg-yellow-400"
          >
            ÷
          </CalculatorButton>

          {/* Row 2 */}
          {["7", "8", "9"].map((number) => (
            <CalculatorButton
              key={number}
              onClick={() => handleNumber(number)}
              className="bg-yellow-100 hover:bg-yellow-200"
            >
              {number}
            </CalculatorButton>
          ))}

          <CalculatorButton
            onClick={() => handleOperator("×")}
            className="bg-yellow-300 hover:bg-yellow-400"
          >
            ×
          </CalculatorButton>

          {/* Row 3 */}
          {["4", "5", "6"].map((number) => (
            <CalculatorButton
              key={number}
              onClick={() => handleNumber(number)}
              className="bg-yellow-100 hover:bg-yellow-200"
            >
              {number}
            </CalculatorButton>
          ))}

          <CalculatorButton
            onClick={() => handleOperator("-")}
            className="bg-yellow-300 hover:bg-yellow-400"
          >
            −
          </CalculatorButton>

          {/* Row 4 */}
          {["1", "2", "3"].map((number) => (
            <CalculatorButton
              key={number}
              onClick={() => handleNumber(number)}
              className="bg-yellow-100 hover:bg-yellow-200"
            >
              {number}
            </CalculatorButton>
          ))}

          <CalculatorButton
            onClick={() => handleOperator("+")}
            className="bg-yellow-300 hover:bg-yellow-400"
          >
            +
          </CalculatorButton>

          {/* Row 5 */}
          <CalculatorButton
            onClick={() => handleNumber("0")}
            className="col-span-2 bg-yellow-100 hover:bg-yellow-200"
          >
            0
          </CalculatorButton>

          <CalculatorButton
            onClick={handleDecimal}
            className="bg-yellow-100 hover:bg-yellow-200"
          >
            .
          </CalculatorButton>

          <CalculatorButton
            onClick={handleEquals}
            className="bg-yellow-400 hover:bg-yellow-500"
          >
            =
          </CalculatorButton>

        </div>

        {/* Instructions */}
        <div className="mt-8 border-t border-yellow-200 pt-6">

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            How to Use
          </h2>

          <ul className="list-disc list-inside space-y-2 text-gray-600">
            <li>Click the number buttons to enter numbers.</li>
            <li>Choose an operator: +, −, ×, or ÷.</li>
            <li>Click = to display the final result.</li>
            <li>Use % for percentage calculations.</li>
            <li>Click DEL to remove the last character.</li>
            <li>Click AC to clear and reset the calculator.</li>
            <li>Use the decimal button for decimal numbers.</li>
            <li>Dividing by zero will display an Error message.</li>
          </ul>

          <h2 className="text-2xl font-bold text-gray-800 mt-6 mb-3">
            Supported Operations
          </h2>

          <p className="text-gray-600 leading-relaxed">
            This calculator supports addition, subtraction,
            multiplication, division, percentage, decimal numbers,
            delete, clear, and continuous calculations.
          </p>

        </div>

      </div>

    </main>
  )
}

export default App