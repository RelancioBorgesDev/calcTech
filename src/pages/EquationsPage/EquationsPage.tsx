import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import MathKeyboard from "../../components/MathKeyboard/MathKeyboard";
import LoadingScreen from "../../components/LoadingScreen";
import ResultDisplay from "../../components/resultDisplay/ResultDisplay"; 
import {
    bolzanoMethod,
    bisectionMethod,
    newtonRaphsonMethod,
    secantMethod,
} from "../../utils/calculations";
import styles from "./styles.module.css";

const EquationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [functionInput, setFunctionInput] = useState("");
    const [intervalA, setIntervalA] = useState<number>(0);
    const [intervalB, setIntervalB] = useState<number>(0);
    const [initialGuess, setInitialGuess] = useState<number>(0);
    const [result, setResult] = useState<string | number | null>(null);
    const [loading, setLoading] = useState(false);
    const [method, setMethod] = useState<string | null>(null);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(
        localStorage.getItem("selectedMethod") || null
    );

    // Referência aos inputs
    const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

    // Função para lidar com a mudança nos inputs e manter o foco
    const handleInputChange = (input: string | ((prev: string) => string), inputName: string) => {
        if (typeof input === "string") {
            setFunctionInput((prev) => prev + input);
        } else {
            setFunctionInput(input);
        }

        if (inputRefs.current[inputName]) {
            inputRefs.current[inputName]?.focus();
        }
    };

    useEffect(() => {
        const storedMethod = localStorage.getItem("selectedCategory");
        setMethod(selectedMethod);
        setResult(null);
    }, []);

    const getMethodName = () => {
        switch (method) {
            case "Bolzano":
                return "Bolzano";
            case "Bissecção":
                return "Bissecção";
            case "Newton-Raphson":
                return "Newton-Raphson";
            case "Secante":
                return "Secante";
            default:
                return "Método desconhecido";
        }
    };

    const handleCalculate = () => {
        if (!method || !functionInput) {
            alert("Por favor, insira uma função :)");
            return;
        }

        setLoading(true);
        setTimeout(() => {
            let calculatedResult: string | number | null = null;
            try {
                if (method === "Bolzano") {
                    calculatedResult = bolzanoMethod(functionInput);
                } else if (method === "Bissecção") {
                    calculatedResult = bisectionMethod(functionInput);
                } else if (method === "Newton-Raphson") {
                    calculatedResult = newtonRaphsonMethod(functionInput);
                } else if (method === "Secante") {
                    calculatedResult = secantMethod(functionInput);
                }
            } catch (error) {
                calculatedResult =
                    "Erro ao processar a função. Verifique a entrada e tente novamente.";
            }

            setResult(calculatedResult);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className={styles.container}>
            <h2>Resolução de Equações Linear</h2>
            <h3>Método escolhido: {getMethodName()}</h3>

            <input
                ref={(el) => (inputRefs.current["functionInput"] = el)}
                type="text"
                value={functionInput}
                onChange={(e) => setFunctionInput(e.target.value)}
                placeholder="Insira a sua f(x) aqui"
            />
            <MathKeyboard onInput={(input) => handleInputChange(input, "functionInput")} />

            {method === "newton" && (
                <input
                    ref={(el) => (inputRefs.current["initialGuess"] = el)} // Referência do input inicial
                    type="number"
                    value={initialGuess}
                    onChange={(e) => setInitialGuess(Number(e.target.value))}
                    placeholder="Ponto inicial"
                />
            )}

            {(method === "bolzano" ||
                method === "bisection" ||
                method === "secant") && (
                <>
                    <input
                        ref={(el) => (inputRefs.current["intervalA"] = el)} // Referência do input Intervalo A
                        type="number"
                        value={intervalA}
                        onChange={(e) => setIntervalA(Number(e.target.value))}
                        placeholder="Intervalo A"
                    />
                    <input
                        ref={(el) => (inputRefs.current["intervalB"] = el)} // Referência do input Intervalo B
                        type="number"
                        value={intervalB}
                        onChange={(e) => setIntervalB(Number(e.target.value))}
                        placeholder="Intervalo B"
                    />
                </>
            )}

<div className={styles.actionsContainer}>
        {/* Loading ou Resultado */}
        <div className={styles.resultArea}>
            {loading ? (
                <LoadingScreen />
            ) : (
                <ResultDisplay result={result || ''} loading={loading} />
            )}
        </div>

        {/* Botões de Ação */}
        <div className={styles.buttonGroup}>
            <button className={styles.calculateButton} onClick={handleCalculate}>
                Calcular
            </button>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
                Voltar
            </button>
        </div>
    </div>
        </div>
    );
};

export default EquationsPage;
