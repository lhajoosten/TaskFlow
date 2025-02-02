# Use official .NET runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5000

# Build Stage
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# ✅ Fix paths to correctly reference `src/` in GitHub Actions
COPY src/TaskFlow.Api/TaskFlow.Api.csproj TaskFlow.Api/
COPY src/TaskFlow.Application/TaskFlow.Application.csproj TaskFlow.Application/
COPY src/TaskFlow.Domain/TaskFlow.Domain.csproj TaskFlow.Domain/
COPY src/TaskFlow.Infrastructure/TaskFlow.Infrastructure.csproj TaskFlow.Infrastructure/
COPY src/TaskFlow.Identity/TaskFlow.Identity.csproj TaskFlow.Identity/

# Restore dependencies
RUN dotnet restore TaskFlow.Api/TaskFlow.Api.csproj

# Copy all source files
COPY src/. .

# Build the solution
RUN dotnet build TaskFlow.Api/TaskFlow.Api.csproj -c Release -o /app/build

# Publish Stage
FROM build AS publish
RUN dotnet publish TaskFlow.Api/TaskFlow.Api.csproj -c Release -o /app/publish /p:UseAppHost=false

# Final Runtime Stage
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENV ASPNETCORE_URLS=http://+:5000
ENTRYPOINT ["dotnet", "TaskFlow.Api.dll"]
